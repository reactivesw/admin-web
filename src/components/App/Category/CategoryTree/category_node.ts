import { SetOrderHintData } from '../model/UpdateCategory'

const INIT_POSITION_NUMBER: number = 1

export default class CategoryNode {

  static nextPosition: number

  category: object // the original category
  children: CategoryNode[]
  parent: CategoryNode | null  // use parent to find orderHints when change position
  position: number  // the position in its parent
  positions: number[]  // all sibling positions

  constructor(category: object) {
    this.category = category
    this.children = []
    this.position = CategoryNode.nextPosition++
    this.parent = null
  }

  static ResetPosition() {
    CategoryNode.nextPosition = INIT_POSITION_NUMBER
  }

  addChild(child: CategoryNode) {
    child.parent = this
    this.children.push(child)
  }

  isParent(): boolean {
    return this.children.length > 0
  }

  getId(): string {
    return this.category['id']
  }

  getName(): string {
    return this.category['name']
  }

  getOrderHint(): string {
    return this.category['orderHint']
  }

  getVersion(): number {
    return this.category['version']
  }

  setPoistions(positions: number[]) {
    this.positions = positions
  }

  getOrderHintData(fromPos: number, toPos: number): SetOrderHintData {
    const parent: CategoryNode = this.parent as CategoryNode
    let previousOrderHint: string
    let nextOrderHint: string

    let prevIndex, nextIndex

    // position increase
    if (fromPos < toPos) {
      previousOrderHint = parent.children[toPos - 1].getOrderHint()
      if (toPos < parent.children.length) {
        nextOrderHint = parent.children[toPos].getOrderHint()
      } else {
        nextOrderHint = ''
      }
    } else { // position decrease
      if (toPos > 1) {
        previousOrderHint = parent.children[toPos - 2].getOrderHint()
      } else {
        previousOrderHint = '0'
      }
      nextOrderHint = parent.children[toPos - 1].getOrderHint()
    }

    return { previousOrderHint, nextOrderHint }
  }
}

// the data can be in any order
// first get all root categories
export function createRoots(categories) {
  CategoryNode.ResetPosition()
  const retVal: CategoryNode[] = []
  for (let cat of categories) {
    if (!cat.parent) {
      const root = new CategoryNode(cat)
      retVal.push(root)
    }
  }
  return retVal
}

// to calculate the previous and the next order hints in setOrderHint
// we need a virtual parent for root nodes and set their positions
export function addVirtualParent(cNodes: CategoryNode[]) {
  const virtualNode = new CategoryNode({})
  const positions = range(cNodes.length)
  cNodes.forEach(cNode => {
    cNode.setPoistions(positions)
    virtualNode.addChild(cNode)
  })
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