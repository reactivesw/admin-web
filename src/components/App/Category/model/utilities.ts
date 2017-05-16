import CategoryNode from './CategoryNode'
import { CategoryView, CategoryMap } from './Category'

export function buildChildNodes(cNode: CategoryNode,
  categoryMap: CategoryMap): CategoryNode[] {
  const cNodes: CategoryNode[] = []
  for (let child of cNode.children) {
    const cNode = buildNodeFromId(child, categoryMap)
    cNodes.push(cNode)
  }
  return cNodes
}

function buildNodeFromId(id: string, categoryMap: CategoryMap)
  : CategoryNode {
  const category: CategoryView = categoryMap[id]
  const cNode = new CategoryNode(category)
  addChildren(cNode, categoryMap)
  return cNode
}

// simple tree build algorithm for a small data set
// we depend on children's order
export function addChildren(cNode: CategoryNode, categoryMap: CategoryMap) {
  for (let id in categoryMap) {
    const category = categoryMap[id]
    let parentId = category.parent && category.parent.id

    // special case for virtual root
    if (isParent(parentId, cNode.id)) {
      // find insert position
      const insertPos = findPosition(category, cNode, categoryMap)
      cNode.insertAt(insertPos, id)
    }
  }
}

function isParent(parentId, cNodeId) {
  let retVal = false
  if (cNodeId) {
    if (parentId === cNodeId) {
      retVal = true
    }
  } else {
    // special case for virtual root
    if (!parentId) {
      // this is a category without root, it's a child of the virtualRoot
      retVal = true
    }
  }
  return retVal
}

// find the insert position
function findPosition(category: CategoryView, cNode: CategoryNode,
  categoryMap: CategoryMap): number {
  let children = cNode.children
  let position = cNode.children.length
  for (let ii = 0; ii < position; ii++) {
    if (category.orderHint < categoryMap[children[ii]].orderHint) {
      position = ii
      break
    }
  }
  return position
}
