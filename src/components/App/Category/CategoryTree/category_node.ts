class CategoryNode {
  category: object // the original category
  children: CategoryNode[] 

  constructor(category: object) {
    this.category = category
  }

  addChild(child: CategoryNode) {
    this.children.push
  }

  isParent(): boolean {
    return this.children.length > 0
  }

  name() {
    return this.category['name']
  }
}