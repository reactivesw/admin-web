export interface Reference {
  typeId: string
  id: string
}

export interface CategoryView {
  id: string
  version: number
  name: object
  description: object
  slug: string
  orderHint: string
  ancestor: Reference[]
  parent?: Reference
  externalId?: string
  metaTitle?: object
  metaDescription?: object
  metaKeywords?: object
}

export const DummyCategoryView : CategoryView = {
  id: "-1",
  version: -1,
  name: {},
  description: {},
  slug: "",
  orderHint: "-1",
  ancestor: []
}

// not use Map because we target ES5
export interface CategoryMap {
  [catgoryId: string]: CategoryView
}