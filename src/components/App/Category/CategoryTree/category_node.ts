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

  getId() {
    return this.category['id']
  }

  getName() {
    return this.category['name']
  }

  getOrderHint(): string {
    return this.category['orderHint']
  }

  setPoistions(positions: number[]) {
    this.positions = positions
  }

  getOrderHints(fromPos: number, toPos: number): SetOrderHintData {
    const parent: CategoryNode = this.parent as CategoryNode
    let previousOrderHint = '0'  // if the to position is 1
    let nextOrderHint = ''  // if the to position is the last

    let prevIndex, nextIndex

    // position increase
    if (fromPos < toPos) {
      previousOrderHint = parent.children[toPos - 1].getOrderHint()
      if (toPos < parent.children.length) {
        nextOrderHint = parent.children[toPos].getOrderHint()
      }
    } else { // position decrease
      if (toPos > 1) {
        previousOrderHint = parent.children[toPos - 2].getOrderHint()
      }
      nextOrderHint = parent.children[toPos - 1].getOrderHint()
    }

    return { previousOrderHint, nextOrderHint }
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