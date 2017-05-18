const ORDER_HINT_ACTION  = 'setOrderHint'
const SET_NAME_ACTION = 'setName'
const SET_DESCRIPTION_ACTION = 'setDescription'
const SET_EXTERNAL_ID = 'setExternalId'
const SET_META_DESCRIPTION = 'setMetaDescription'
const SET_META_KEYWORDS = 'setMetaKeywords'
const SET_META_TITLE = 'setMetaTitle'
const SET_SLUG = 'setSlug'

export interface Action {
  action: string
}

export interface UpdateCategoryPayload {
  version: number  
  actions: Action[]
}

// used to make api call from components
export interface UpdateCategoryArgs {
  categoryId: string,
  payload: UpdateCategoryPayload
}

export interface SetOrderHintData {
  previousOrderHint: string   // 0 if set to be the first
  nextOrderHint: string  // empty if set to be the last
}

export function buildArgs(categoryId: string, version: number, actions: Action[])
  : UpdateCategoryArgs {
  const payload: UpdateCategoryPayload = {version, actions}
  return {categoryId, payload}
}

export function buildOrderHintArgs(categoryId: string, 
    version: number, data: SetOrderHintData) {
  const action: Action = {
    action: ORDER_HINT_ACTION,
    ...data
  }

  return buildArgs(categoryId, version, [action])    
}

export function buildSetNameAction(name: object) {
  return {
    action: SET_NAME_ACTION,
    name
  }
}

export function buildSetDescriptionAction(description: object) {
  return {
    action: SET_DESCRIPTION_ACTION,
    description
  }
}

export function buildSetExternalId(externalId: string) {
  return {
    action: SET_EXTERNAL_ID,
    externalId
  }
}

export function buildSetMetaDescription(metaDescription: object) {
  return {
    action: SET_META_DESCRIPTION,
    metaDescription
  }
}

export function buildSetMetaKeywords(metaKeywords: object) {
  return {
    action: SET_META_KEYWORDS,
    metaKeywords
  }
}


export function buildSetMetaTitle(metaTitle: object) {
  return {
    action: SET_META_TITLE,
    metaTitle
  }
}

export function buildSetSlug(slug: string) {
  return {
    action: SET_SLUG,
    slug
  }
}

