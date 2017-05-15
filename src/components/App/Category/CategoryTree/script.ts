import Vue from 'vue'
import Component from 'vue-class-component'

import CategoryNode from './category_node'
import { CategoryView, DummyCategoryView } from '../model/Category'

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
  // prop type definition
  categories: CategoryView[]

  // local data
  virtualRoot: CategoryNode = new CategoryNode(DummyCategoryView)

  created() {
    const sorted = this.categories.slice()
    sorted.sort((c1, c2) => {
      return parseFloat(c1.orderHint) - parseFloat(c2.orderHint)
    })

    for (let cat of sorted) {
      if (!cat.parent) {
        const root = new CategoryNode(cat)
        this.virtualRoot.addChild(root)
      }
      this.virtualRoot.resetChildrenIndex()
    }

    addChildren(this.virtualRoot.children, sorted)
  }
}

// simple tree build algorithm for a small data set
function addChildren(cNodes: CategoryNode[], sorted: CategoryView[]) {
  for (let cNode of cNodes) {
    addRawChildren(cNode, sorted)
    if (cNode.isParent()) {
      cNode.resetChildrenIndex()
      // recursively add children's children
      addChildren(cNode.children, sorted)
    }
  }
}

// add children from raw data
function addRawChildren(cNode: CategoryNode, sorted: CategoryView[]) {
  for (let cat of sorted) {
    let parentId = cat.parent && cat.parent.id
    if (cNode.getId() === parentId) {
      const childNode = new CategoryNode(cat)
      cNode.addChild(childNode)
    }
  }
}
