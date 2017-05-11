import Vue from 'vue'
import Component from 'vue-class-component'
import CategoryNode, { addChildren, range } from './category_node'
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
    const retVal: CategoryNode[] = []
    const categories = this.categories

    // the data can be in any order
    // first get all root categories
    CategoryNode.ResetPosition()
    for (let cat of categories) {
      if (!cat.parent) {
        const root = new CategoryNode(cat)
        retVal.push(root)
      }
    }

    const positions = range(retVal.length)
    retVal.forEach(cat => cat.setPoistions(positions))

    addChildren(retVal, categories)
    return retVal
  }
}