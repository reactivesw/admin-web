import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { setOrderHint } from '../api_client'

import CategoryNode from '../model/CategoryNode'
import { CategoryView, CategoryMap } from '../model/Category'
import { buildChildNodes } from '../model/utilities'
import {
  SetOrderHintActionName,
  Action,
  UpdateCategoryArgs,
  SetOrderHintData,
  UpdateCategoryPayload
} from '../model/UpdateCategory'

import { GET_DISABLE_SELECTS, GET_CATEGORY_MAP } from '../store/getters'
import { SET_DISABLE_SELECTS, SET_ORDER_HINT, SET_ERROR_MESSAGE } from '../store/mutations'

@Component({
  props: {
    parent: Object,
    cNode: Object,
    index: Number
  }
})
export default class TreeNode extends Vue {
  parent: CategoryNode
  cNode: CategoryNode  // the input prop
  index: number

  // open or fold of children
  // initially open for virtual root
  isOpen: boolean = false
  newPositionValue: number = -1

  get position() {
    return this.index + 1
  }

  set position(newValue) {
    this.newPositionValue = newValue
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
    const count = this.parent.children.length
    for (let ii = 1; ii <= count; ii++) {
      retVal.push(ii)
    }
    return retVal
  }

  get categoryMap(): CategoryMap {
    return this.$store.getters[GET_CATEGORY_MAP]
  }

  get childNodes(): CategoryNode[] {
    return buildChildNodes(this.cNode, this.categoryMap)
  }

  // when order hint value is not current, may send bad hint data
  async changePositionHandler() {
    this.$store.commit(SET_DISABLE_SELECTS, true)

    const fromPos = this.index + 1
    const toPos = this.newPositionValue

    const orderHints = getOrderHintData(this.parent, this.categoryMap, fromPos, toPos)
    const args = buildPositionArgs(this.cNode, orderHints)
    const result: ApiResult = await setOrderHint(args)

    if (result.error) {
      this.$store.commit(SET_ERROR_MESSAGE, result.error)
    } else {
      this.$store.commit(SET_ORDER_HINT, result.data)
    }

    this.$store.commit(SET_DISABLE_SELECTS, false)
  }
}

// get the prve and next order hint values
function getOrderHintData(parent: CategoryNode,
  categoryMap: CategoryMap, fromPos: number, toPos: number): SetOrderHintData {
  let previousOrderHint: string
  let nextOrderHint: string
  let siblingIds = parent.children

  let prevIndex, nextIndex

  if (fromPos < toPos) { // position increase
    previousOrderHint = categoryMap[siblingIds[toPos - 1]].orderHint
    if (toPos < siblingIds.length) {
      nextOrderHint = categoryMap[siblingIds[toPos]].orderHint
    } else {
      nextOrderHint = ''  // for the last, this is empty
    }
  } else { // position decrease
    if (toPos == 1) {
      previousOrderHint = '0' // for the first, this is 0
    } else {
      previousOrderHint = categoryMap[siblingIds[toPos - 2]].orderHint
    }
    nextOrderHint = categoryMap[siblingIds[toPos - 1]].orderHint
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
    version: cNode.version,
    actions: [action]
  }

  const args: UpdateCategoryArgs = {
    categoryId: cNode.id,
    payload
  }
  return args
}
