import CategoryNode from './CategoryNode'
import { CategoryView, CategoryMap } from './Category'

export function buildChildNodes(cNode: CategoryNode,
  categoryMap: CategoryMap): CategoryNode[] {
  const cNodes: CategoryNode[] = []
  if (cNode) {  // possibly undefined in initialization
    for (let child of cNode.children) {
      const category: CategoryView = categoryMap[child]
      const cNode = new CategoryNode(category)
      cNodes.push(cNode)
      addChildren(cNode, categoryMap)
    }

    // sort by order hints
    cNodes.sort((c1, c2) => {
      return parseFloat(c1.orderHint) - parseFloat(c2.orderHint)
    })

    for (let ii = 0; ii < cNodes.length; ii++) {
      cNodes[ii].index = ii
    }
  }
  return cNodes
}

// simple tree build algorithm for a small data set
// we depend on children's order too
function addChildren(cNode: CategoryNode, categoryMap: CategoryMap) {
  for (let id in categoryMap) {
    const category = categoryMap[id]
    let parentId = category.parent && category.parent.id
    if (parentId === cNode.id) {
      // find insert position
      const insertPos = findPosition(category, cNode, categoryMap)
      cNode.insertAt(insertPos, id)
    }
  }
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