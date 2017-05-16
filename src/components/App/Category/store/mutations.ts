import { CategoryView } from '../model/Category'

export const SET_CATEGORY_MAP = 'category/SET_CATEGORY_MAP'
export const SET_ORDER_HINT = 'category/SET_ORDER_HINT'
export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'
export const SET_ERROR_MESSAGE = 'category/SET_ERROR_MESSAGE'
export const CLEAR_ERROR_MESSAGE = 'category/CLEAR_ERROR_MESSAGE'

const mutations = {
  [SET_CATEGORY_MAP](state, categories) {
    const categoryMap = {}
    categories.forEach(cat => {
      categoryMap[cat.id] = cat
    })
    state.categoryMap = categoryMap
  },

  [SET_ORDER_HINT](state, category: CategoryView) {
    state.categoryMap[category.id] = category
  },

  [SET_DISABLE_SELECTS](state, flag) {
    state.disableSelects = flag
  },

  [SET_ERROR_MESSAGE](state, message) {
    state.errorMessage = message
  },

  [CLEAR_ERROR_MESSAGE](state) {
    state.errorMessage = null
  }

}

export default mutations
