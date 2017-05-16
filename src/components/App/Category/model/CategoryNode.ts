import { CategoryView, DummyCategoryView } from './Category'
import { SetOrderHintData } from './UpdateCategory'

export default class CategoryNode {

  private _category: CategoryView  // the original category
  private _children: string[] // to calculate the position in the category tree

  constructor(category: CategoryView) {
    this._category = category
    this._children = []
  }

  insertAt(position: number, id: string) {
    this._children.splice(position, 0, id)
  }

  isParent(): boolean {
    return this._children.length > 0
  }

  get id(): string {
    return this._category.id
  }

  get name(): object {
    return this._category.name
  }

  get orderHint(): string {
    return this._category.orderHint
  }

  get version(): number {
    return this._category.version
  }

  get children(): string[] {
    return this._children
  }

  set children(children: string[]) {
    this._children = children
  }
}
