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
  version: 0,
  name: {},
  description: {},
  slug: "",
  orderHint: "",
  ancestor: []
}