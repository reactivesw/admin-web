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

  changePositionHandler() {
    this.$emit('changePositionEvent', this.cNode.getId(), this.position)
  }
}