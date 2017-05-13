import { CategoryView, DummyCategoryView } from '../model/Category'
import { SetOrderHintData } from '../model/UpdateCategory'

const INIT_POSITION_NUMBER: number = 1

export default class CategoryNode {

  category: CategoryView  // the original category
  children: CategoryNode[]
  parent: CategoryNode | null // use parent to find orderHints when change position

  constructor(category: CategoryView) {
    this.category = category
    this.children = []
    this.parent = null
  }

  addChild(child: CategoryNode) {
    child.parent = this
    this.children.push(child)
  }

  isParent(): boolean {
    return this.children.length > 0
  }

  getId(): string {
    return this.category.id
  }

  getName(): object {
    return this.category.name
  }

  getOrderHint(): string {
    return this.category.orderHint
  }

  getVersion(): number {
    return this.category.version
  }
}
