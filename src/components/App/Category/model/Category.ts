export interface Reference {
  typeId: string
  id: string
}

export interface CategoryDraft {
  name: object
  description?: object
  parent?: Reference
  slug: string
  orderHint?: string
  externalId?: string
  metaTitle?: object
  metaDescription?: object
  metaKeywords?: object
}

export function getEmptyCategoryDraft(): CategoryDraft {
  return {
    name: {},
    description: {},
    slug: "",
    externalId: "",
    metaTitle: {},
    metaDescription: {},
    metaKeywords: {}
  }
}

export interface CategoryView extends CategoryDraft {
  id: string
  version: number
  ancestor: Reference[]
  orderHint: string   // override the draft
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

// the local has empty values when the original is undefined
export function isSameLocalStr(local: object, original: object | undefined) {
  let retVal = true
  if (original) {
    for (let langId in local) {
      if (local[langId] !== original[langId]) {
        retVal = false
        break
      }
    }
  } else { // the original is undefined
    // if the first has all non-empty values, they are the same. Otherwise, not. 
    for (let key in local) {
      if (local[key]) {
        retVal = false
        break
      }
    }
  }
  return retVal
}

// jsonStr might be undefined, which is "" for the local string
export function isSameJsonStr(local: string, jsonStr: string | undefined) {
  let retVal = false
  if (jsonStr) {
    retVal = jsonStr === local
  } else {
    if (!local) {
      retVal = true
    }
  }
  return retVal
}
