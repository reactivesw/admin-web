export const GET_CATEGORY_MAP = 'category/GET_CATEGORY_MAP'
export const GET_DISABLE_SELECTS = 'category/GET_DISABLE_SELECTS'

const getters = {

  [GET_CATEGORY_MAP](state) {
    return state.categoryMap
  },

  [GET_DISABLE_SELECTS](state) {
    return state.disableSelects
  }
}

export default getters
