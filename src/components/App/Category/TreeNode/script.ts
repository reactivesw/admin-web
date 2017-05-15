import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { setOrderHint } from '../api_client'

import CategoryNode from '../model/CategoryNode'
import { CategoryView } from '../model/Category'
import {
  SetOrderHintActionName,
  Action,
  UpdateCategoryArgs,
  SetOrderHintData,
  UpdateCategoryPayload
} from '../model/UpdateCategory'

import { GET_DISABLE_SELECTS } from '../store/getters'
import { SET_DISABLE_SELECTS, SET_ORDER_HINT } from '../store/mutations'

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
  
  // change order hint request is in progress, dsiable select control
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

    const orderHints = getOrderHintData(this.cNode, fromPos, toPos)
    const args = buildPositionArgs(this.cNode, orderHints)
    const result: ApiResult = await setOrderHint(args)

    if (result.error) {
      // TODO: show error
      // undo select change
      this.position = fromPos
    } else {
      // this.$store.commit(SET_ORDER_HINT, result.data)
    }

    this.$store.commit(SET_DISABLE_SELECTS, false)
  }
}

// get the prve and next order hint values
function getOrderHintData(cNode: CategoryNode, 
    fromPos: number, toPos: number): SetOrderHintData {
  const parent: CategoryNode = cNode.parent as CategoryNode
  let previousOrderHint: string
  let nextOrderHint: string
  let siblings = parent.children

  let prevIndex, nextIndex

  if (fromPos < toPos) { // position increase
    previousOrderHint = siblings[toPos - 1].getOrderHint()
    if (toPos < parent.children.length) {
      nextOrderHint = siblings[toPos].getOrderHint()
    } else {
      nextOrderHint = ''  // for the last, this is empty
    }
  } else { // position decrease
    if (toPos == 0) {
      previousOrderHint = '0' // for the first, this is 0
    } else {
      previousOrderHint = siblings[toPos - 2].getOrderHint()
    }
    nextOrderHint = siblings[toPos - 1].getOrderHint()
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
