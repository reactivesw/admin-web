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

  isOpen = false
  position = -1
  oldPosition = -1

  created() {
    this.position = this.index + 1
    this.oldPosition = this.position
  }

  toggle() {
    if (this.cNode.isParent) {
      this.isOpen = !this.isOpen
    }
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
  }
}