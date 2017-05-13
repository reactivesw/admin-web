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

@Component({
  props: {
    cNode: Object
  }
})
export default class TreeNode extends Vue {
  cNode: CategoryNode  // the input prop

  isOpen = false
  position = -1

  created() {
    this.position = this.cNode.position
  }

  toggle() {
    if (this.cNode.isParent) {
      this.isOpen = !this.isOpen
    }
  }

  get isSelectDisabled() {
    return this.$store.getters[GET_DISABLE_SELECTS]
  }

  // when order hint value is not current, may send bad hint data
  async changePositionHandler() {
    this.$store.commit(SET_DISABLE_SELECTS, true)

    const orderHints: SetOrderHintData = getOrderHintData(
      this.cNode, this.cNode.position, this.position
    )
    const args = buildPositionArgs(this.cNode, orderHints)
    const result = await setOrderHint(args)

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