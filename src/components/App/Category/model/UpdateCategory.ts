export type ActionName = 
  'setName' | 'setDescription' 
  | 'setExternalId' | 'setMetaDescription'
  | 'setMetaKeywords' | 'setMetaTitle'
  | 'setOrderHint' | 'setParent'
  | 'setSlug'

export interface Action {
  action: ActionName
}

export interface UpdateCategory {
  version: number  
  actions: Action[]
}

export interface SetOrderHintData {
  previousOrderHint: string   // 0 if set to be the first
  nextOrderHint: string  // empty if set to be the last
}

export interface SetOrderHintAction extends Action, SetOrderHintData {
}