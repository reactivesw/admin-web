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

export const DummyCategoryView: CategoryView = {
  id: "",
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

export function isSameLocalStr(first: object, second: object | undefined) {
  let retVal = true
  if (second) {
    for (let langId in first) {
      if (first[langId] !== second[langId]) {
        retVal = false
        break
      }
    }
  } else {
    retVal = false
  }
  return retVal
}

// jsonStr might be undefined, which is "" for the local string
export function isSameJsonStr(str: string, jsonStr: string | undefined) {
  let retVal = false
  if (jsonStr) {
    retVal = jsonStr === str
  } else {
    if (!str) {
      retVal = true
    }
  }
  return retVal
}