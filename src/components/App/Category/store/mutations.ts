export const INITIAL_DISABLE_SELECTS_VALUE = false
export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'
export const SET_ORDER_HINT_CATEGORY = 'category/SET_ORDER_HINT_CATEGORY'

const mutations = {
  [SET_DISABLE_SELECTS](state, flag) {
    state.disableSelects = flag
  }, 
  [SET_ORDER_HINT_CATEGORY](state, category) {
    state.orderHintCategory = category
  }
}

export default mutations