export const SetOrderHintActionName = 'setOrderHint'

export type ActionName = 
  'setName' | 'setDescription' 
  | 'setExternalId' | 'setMetaDescription'
  | 'setMetaKeywords' | 'setMetaTitle'
  | 'setOrderHint' | 'setParent'
  | 'setSlug'

export interface Action {
  action: ActionName
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

export interface SetOrderHintAction extends Action, SetOrderHintData {
}