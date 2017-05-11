const INIT_POSITION_NUMBER: number = 1

export default class CategoryNode {

  static nextPosition: number

  category: object // the original category
  children: CategoryNode[]
  isOpen: boolean = false  // default is folded 
  position: number  // the position in its parent

  constructor(category: object) {
    this.category = category
    this.children = []
    this.position = CategoryNode.nextPosition++
  }

  static ResetPosition() {
    CategoryNode.nextPosition = INIT_POSITION_NUMBER
  }

  addChild(child: CategoryNode) {
    this.children.push
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

  getPoistions(): number[] {
    return range(this.children.length)
  }
}

// not an efficient algorithm to build the tree, should be fine
export function addChildren(nodes: CategoryNode[], categories) {
  for (let cNode of nodes) {
    CategoryNode.ResetPosition()
    for (let cat of categories) {
      let parentId = cat.parent && cat.parent.id
      if (cNode.getId() === parentId) {
        const childNode = new CategoryNode(cat)
        cNode.addChild(childNode)
      }
    }

    if (cNode.isParent()) {
      addChildren(cNode.children, categories)
    }
  }
}

export function range(count: number): number[] {
  const retVal: number[] = []
  for (let ii = 1; ii <= count; ii++) {
    retVal.push(ii)
  }
  return retVal
}