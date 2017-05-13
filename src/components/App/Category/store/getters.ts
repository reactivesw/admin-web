export const GET_DISABLE_SELECTS = 'category/GET_DISABLE_SELECTS'
export const GET_ORDER_HINT_CATEGORY = 'category/GET_ORDER_HINT_CATEGORY'

const getters = {
  [GET_DISABLE_SELECTS](state) {
    return state.disableSelects
  }, 

  [GET_ORDER_HINT_CATEGORY](state) {
    return state.orderHintCategory
  }
}

export default getters