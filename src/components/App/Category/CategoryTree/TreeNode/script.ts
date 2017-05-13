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

@Component({
  props: {
    cNode: Object
  }
})
export default class TreeNode extends Vue {
  cNode: CategoryNode  // the input prop

  isOpen = false
  position = -1

  testSelect = true

  created() {
    this.position = this.cNode.position
  }

  toggle() {
    if (this.cNode.isParent) {
      this.isOpen = !this.isOpen
    }
  }

  async changePositionHandler() {
    const orderHints: SetOrderHintData = this.cNode.getOrderHintData(
      this.cNode.position, this.position
    )

    const action: Action = {
      action: SetOrderHintActionName,
      ...orderHints
    }

    const payload: UpdateCategoryPayload = {
      version: this.cNode.getVersion(),
      actions: [action]
    }

    const args: UpdateCategoryArgs = {
      categoryId: this.cNode.getId(),
      payload
    }

    const result = await setOrderHint(args)
    console.log(result)
  }
}