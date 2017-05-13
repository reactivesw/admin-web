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
    for (let cat of this.categories) {
      if (!cat.parent) {
        const root = new CategoryNode(cat)
        this.virtualRoot.addChild(root)
      }
    }

    addChildren(this.virtualRoot.children, this.categories)
  }
}

// simple tree build algorithm for a small data set
function addChildren(cNodes: CategoryNode[], categories: CategoryView[]) {
  for (let cNode of cNodes) {
    addRawChildren(cNode, categories)
    if (cNode.isParent()) {
      // recursively add children's children
      addChildren(cNode.children, categories)
    }
  }
}

// add children from raw data
function addRawChildren(cNode: CategoryNode, categories: CategoryView[]) {
  for (let cat of categories) {
    let parentId = cat.parent && cat.parent.id
    if (cNode.getId() === parentId) {
      const childNode = new CategoryNode(cat)
      cNode.addChild(childNode)
    }
  }
}
