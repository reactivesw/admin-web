import Vue from 'vue'
import Component from 'vue-class-component'
import CategoryNode, { addChildren, range } from './category_node'

@Component({
  props: {
    categories: Array
  }
})
export default class CategoryTree extends Vue {
  categories

  // convert the flat array into an array of trees
  get tree(): CategoryNode[] {
    const retVal: CategoryNode[] = []
    const categories = this.categories

    // the data can be in any order
    // first get all root categories
    CategoryNode.ResetPosition()
    for (let cat of categories) {
      if (cat.ancestors.length === 0) {
        const root = new CategoryNode(cat)
        retVal.push(root)
      }
    }

    addChildren(retVal, categories)
    return retVal
  }

  get positions(): number[] {
    return range(this.tree.length)
  }
}