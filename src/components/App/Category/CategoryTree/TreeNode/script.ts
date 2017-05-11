import Vue from 'vue'
import Component from 'vue-class-component'
import CategoryNode from '../category_node'

@Component({
  props: {
    cNode: Object
  }
})
export default class TreeNode extends Vue {
  cNode: CategoryNode  // the input prop

  isOpen = false

  toggle() {
    if (this.cNode.isParent) {
      this.isOpen = !this.isOpen
    }
  }
}