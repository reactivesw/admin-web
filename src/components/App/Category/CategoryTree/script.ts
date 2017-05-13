import Vue from 'vue'
import Component from 'vue-class-component'
import CategoryNode, { addChildren, range, 
  createRoots, addVirtualParent } from './category_node'
import TreeNode from 'src/components/App/Category/CategoryTree/TreeNode'

@Component({
  components: {
    TreeNode
  }, 
  props: {
    categories: Array
  }
})
export default class CategoryTree extends Vue {
  categories

  // convert the flat array into an array of trees
  get categoryNodes(): CategoryNode[] {
    const categories = this.categories
    const retVal: CategoryNode[] = createRoots(categories)
    addVirtualParent(retVal)
    addChildren(retVal, categories)
    return retVal
  }
}