import CategoryNode from '../model/CategoryNode'
import { CategoryView, DummyCategoryView } from '../model/Category'

export const SET_CATEGORY_TREE = 'category/SET_CATEGORY_TREE'
export const SET_ORDER_HINT = 'category/SET_ORDER_HINT'
export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'

const mutations = {
  [SET_CATEGORY_TREE](state, categories) {
    state.categoryTree = buildCategoryTree(categories)
  },

  [SET_ORDER_HINT](state, category) {
    updateOrderHints(state.categoryTree, category)
  },

  [SET_DISABLE_SELECTS](state, flag) {
    state.disableSelects = flag
  }
}

export default mutations

function buildCategoryTree(categories: CategoryView[]) {
  // local data
  const virtualRoot: CategoryNode = new CategoryNode(DummyCategoryView)

  categories.sort((c1, c2) => {
    return parseFloat(c1.orderHint) - parseFloat(c2.orderHint)
  })

  for (let cat of categories) {
    if (!cat.parent) {
      const root = new CategoryNode(cat)
      virtualRoot.addChild(root)
    }
    virtualRoot.resetChildrenIndex()
  }

  addChildren(virtualRoot.children, categories)
  return virtualRoot
}

function addRooNodes(virtualRoot: CategoryNode, categories: CategoryView[]) {
  for (let cat of categories) {
    if (!cat.parent) {
      const root = new CategoryNode(cat)
      virtualRoot.addChild(root)
    }
    virtualRoot.resetChildrenIndex()
  }
}

// simple tree build algorithm for a small data set
function addChildren(cNodes: CategoryNode[], categories: CategoryView[]) {
  for (let cNode of cNodes) {
    addRawChildren(cNode, categories)
    if (cNode.isParent()) {
      cNode.resetChildrenIndex()
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

function updateOrderHints(virtualRoot, category) {
  let parent = removeOld(virtualRoot, category)
  const siblings = parent.children
  let insertPos = updateSiblingIndexes(parent, category)

  // insert the new category
  const insertNode = new CategoryNode(category)
  insertNode.parent = parent
  insertNode.children = parent.children2
  insertPos = insertPos >= 0 ? insertPos : siblings.length
  insertNode.index = insertPos
  siblings.splice(insertPos, 0, insertNode)
}

function updateSiblingIndexes(parent: CategoryNode, category: CategoryView): number {
  let siblings = parent.children
  let insertPos = -1
  for (let pos = 0; pos < siblings.length; pos++) {
    // use clone to trigger state update
    let oldChild = siblings[pos]
    let cloneNode = new CategoryNode(oldChild.category)
    cloneNode.parent = oldChild.parent
    cloneNode.children = oldChild.children
    if (parseFloat(category.orderHint) < parseFloat(siblings[pos].getOrderHint())) {
      if (insertPos === -1) {
        insertPos = pos
      }
    }

    if (insertPos === -1) {
      // keep the current index
      cloneNode.index = pos
    } else {  // after the inserted 
      cloneNode.index = pos + 1
    }

    // trigger index state update
    siblings.splice(pos, 1, cloneNode)
  }

  return insertPos
}

// find and remove the old node
function removeOld(cNode: CategoryNode, category: CategoryView): CategoryNode {
  let parent
  const children = cNode.children
  if (children.length > 0) {
    const index = children.findIndex(child => child.getId() === category.id)
    console.log(`findIndex result: ${index}`)
    if (index >= 0) {
      // store it and put it back to the new node
      cNode.children2 = children[index].children
      children.splice(index, 1)   // remove it
      parent = cNode
    } else {
      for (let child of children) {
        let parent = removeOld(child, category)
        if (parent) {
          break
        }
      }
    }
  }
  return parent
}