import Vue from 'vue'
import Component from 'vue-class-component'

import CategoryNode from './category_node'
import { CategoryView, DummyCategoryView } from '../model/Category'

import { GET_ORDER_HINT_CATEGORY } from '../store/getters'

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

  get children(): CategoryNode[] {
    if (this.setOrderHint) {
      updateCategoryHint(this.virtualRoot, this.setOrderHint)
    }
    return this.virtualRoot.children
  }

  // dummy computed value to update category with new order hint
  get setOrderHint() {
    return this.$store.getters[GET_ORDER_HINT_CATEGORY]
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

function updateCategoryHint(virtualRoot: CategoryNode, category: CategoryView) {
  let parent: CategoryNode | undefined = removeOld(virtualRoot, category)
  if (parent) {
    
    let children: CategoryNode[] = []
    const insertNode = new CategoryNode(category)
    insertNode.parent = parent
    insertNode.children = parent.children2

    let oldChildren = parent.children
    let insertPos = -1
    for (let pos = 0; pos < oldChildren.length; pos++) {
      let cloneNode 
      if (parseFloat(category.orderHint) < parseFloat(oldChildren[pos].getOrderHint())) {
        insertPos = pos
      } 
      
      if (insertPos === -1) {
        // keep the current index
        oldChildren[pos].index = pos
        cloneNode = oldChildren[pos]
      } else {  // after the inserted 
        oldChildren[pos].index = pos + 1
        cloneNode = oldChildren[pos]
      }
      
      children.push(cloneNode)
    }
    
    insertPos = insertPos >= 0? insertPos: oldChildren.length
    insertNode.index = insertPos
    children.splice(insertPos, 0, insertNode)
    parent.children = children
  }
}

// find and remove the old node
function removeOld(cNode: CategoryNode, category: CategoryView): CategoryNode | undefined {
  const children = cNode.children
  const length = children.length
  if (length > 0) {
    const index = children.findIndex(child => child.getId() === category.id)
    if (index >= 0) {
      // store it and put it back to the new node
      cNode.children2 = children[index].children
      children.splice(index, 1)
      return cNode
    }

    for (let child of children) {
      let parent = removeOld(child, category)
      if (parent) {
        return parent
      }
    }
  }

}
