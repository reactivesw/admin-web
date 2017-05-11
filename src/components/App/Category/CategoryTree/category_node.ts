const INIT_POSITION_NUMBER: number = 1

export default class CategoryNode {

  static nextPosition: number

  category: object // the original category
  children: CategoryNode[]
  position: number  // the position in its parent
  positions: number[]  // all sibling positions

  constructor(category: object) {
    this.category = category
    this.children = []
    this.position = CategoryNode.nextPosition++
  }

  static ResetPosition() {
    CategoryNode.nextPosition = INIT_POSITION_NUMBER
  }

  addChild(child: CategoryNode) {
    this.children.push(child)
  }

  isParent(): boolean {
    return this.children.length > 0
  }

  getId() {
    return this.category['id']
  }

  getName() {
    return this.category['name']
  }

  setPoistions(positions: number[]) {
    this.positions = positions
  }
}

// simple tree build algorithm for a small data set
export function addChildren(cNodes: CategoryNode[], categories) {
  for (let cNode of cNodes) {
    CategoryNode.ResetPosition()
    addRawChildren(cNode, categories)
    if (cNode.isParent()) {
      setChildrenPositions(cNode)

      // recursively add children's children
      addChildren(cNode.children, categories)
    }
  }
}

// add children from raw data
export function addRawChildren(cNode: CategoryNode, categories) {
  for (let cat of categories) {
    let parentId = cat.parent && cat.parent.id
    if (cNode.getId() === parentId) {
      const childNode = new CategoryNode(cat)
      cNode.addChild(childNode)
    }
  }
}

export function setChildrenPositions(cNode: CategoryNode) {
  const positions = range(cNode.children.length)
  cNode.children.forEach(child => child.setPoistions(positions))
}

export function range(count: number): number[] {
  const retVal: number[] = []
  for (let ii = 1; ii <= count; ii++) {
    retVal.push(ii)
  }
  return retVal
}