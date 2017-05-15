import Vue from 'vue'
import Component from 'vue-class-component'

import CategoryNode from '../category_node'
import { setOrderHint } from '../../api_client'

import {
  SetOrderHintActionName,
  Action,
  UpdateCategoryArgs,
  SetOrderHintData,
  UpdateCategoryPayload
}
  from '../../model/UpdateCategory'

import { CategoryView } from '../../model/Category'


import { GET_DISABLE_SELECTS } from '../../store/getters'
import { SET_DISABLE_SELECTS } from '../../store/mutations'

import { ApiResult } from 'src/infrastructure/api_client'

@Component({
  props: {
    cNode: Object,
    index: Number
  }
})
export default class TreeNode extends Vue {
  cNode: CategoryNode  // the input prop
  index: number

  // open or fold of children
  // initially open for virtual root
  isOpen: boolean = false
  position: number
  oldPosition: number

  created() {
    this.position = this.index + 1
    this.oldPosition = this.index + 1
  }

  beforeUpdated() {
    this.position = this.index + 1
  }

  toggleOpen() {
    this.isOpen = !this.isOpen
  }

  get isSelectDisabled() {
    return this.$store.getters[GET_DISABLE_SELECTS]
  }

  get options() {
    const retVal: number[] = []
    let parent = this.cNode.parent
    if (parent) {
      for (let ii = 1; ii <= parent.children.length; ii++) {
        retVal.push(ii)
      }
    }
    return retVal
  }


  // when order hint value is not current, may send bad hint data
  async changePositionHandler() {
    this.$store.commit(SET_DISABLE_SELECTS, true)

    const fromPos = this.oldPosition
    const toPos = this.position

    const orderHints: SetOrderHintData = getOrderHintData(
      this.cNode, fromPos, toPos
    )
    const args = buildPositionArgs(this.cNode, orderHints)
    const result: ApiResult = await setOrderHint(args)
    processResult(result, this, fromPos, toPos)

    this.$store.commit(SET_DISABLE_SELECTS, false)
  }
}

// get the prve and next order hint values
function getOrderHintData(cNode: CategoryNode,
  fromPos: number,
  toPos: number): SetOrderHintData {
  const parent: CategoryNode = cNode.parent as CategoryNode
  let previousOrderHint: string
  let nextOrderHint: string

  let prevIndex, nextIndex

  // position increase
  if (fromPos < toPos) {
    previousOrderHint = parent.children[toPos - 1].getOrderHint()
    if (toPos < parent.children.length) {
      nextOrderHint = parent.children[toPos].getOrderHint()
    } else {
      nextOrderHint = ''
    }
  } else { // position decrease
    if (toPos > 1) {
      previousOrderHint = parent.children[toPos - 2].getOrderHint()
    } else {
      previousOrderHint = '0'
    }
    nextOrderHint = parent.children[toPos - 1].getOrderHint()
  }

  return { previousOrderHint, nextOrderHint }
}

function buildPositionArgs(cNode: CategoryNode,
  hintData: SetOrderHintData): UpdateCategoryArgs {
  const action: Action = {
    action: SetOrderHintActionName,
    ...hintData
  }

  const payload: UpdateCategoryPayload = {
    version: cNode.getVersion(),
    actions: [action]
  }

  const args: UpdateCategoryArgs = {
    categoryId: cNode.getId(),
    payload
  }
  return args
}

function processResult(result: ApiResult,
  tNode: TreeNode, fromPos: number, toPos: number) {

  const cNode = tNode.cNode
  if (result.error) {
    // undo select change
    tNode.position = tNode.oldPosition
  } else {
    const category: CategoryView = result.data

    // looped component, use store to share change
    // tNode.$store.commit(SET_ORDER_HINT_CATEGORY, category)
  
    let cNodeParent = cNode.parent
    if (cNodeParent) {
      updateCategoryHint(cNodeParent, category)
    }
  }
}

function updateCategoryHint(cNodeParent: CategoryNode, category: CategoryView) {
  let parent: CategoryNode | undefined = removeOld(cNodeParent, category)
  if (parent) {
    
    const insertNode = new CategoryNode(category)
    insertNode.parent = parent
    insertNode.children = parent.children2

    let oldChildren = parent.children
    let insertPos = -1
    for (let pos = 0; pos < oldChildren.length; pos++) {
      // use clone to trigger state update
      let oldChild = oldChildren[pos]
      let cloneNode = new CategoryNode(oldChild.category)
      cloneNode.parent = oldChild.parent
      cloneNode.children = oldChild.children
      if (parseFloat(category.orderHint) < parseFloat(oldChildren[pos].getOrderHint())) {
        if (insertPos === -1) {
          insertPos = pos
        }
      } 
      
      if (insertPos === -1) {
        // keep the current index
        cloneNode.index = pos
      } else {  // after the inserted 
        cloneNode.index = pos + 1
      }
      
      // trigger index state update
      oldChildren.splice(pos, 1, cloneNode)
    }
    
    insertPos = insertPos >= 0? insertPos: oldChildren.length
    insertNode.index = insertPos
    oldChildren.splice(insertPos, 0, insertNode)
  }
}

// find and remove the old node
function removeOld(cNode: CategoryNode, category: CategoryView): CategoryNode | undefined {
  const children = cNode.children
  const length = children.length
  if (length > 0) {
    const index = children.findIndex(child => child.getId() === category.id)
    if (index >= 0) {
      // store it and put it back to the new node
      cNode.children2 = children[index].children
      children.splice(index, 1)
      return cNode
    }

    for (let child of children) {
      let parent = removeOld(child, category)
      if (parent) {
        return parent
      }
    }
  }

}