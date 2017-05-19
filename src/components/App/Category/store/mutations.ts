import { CategoryView } from '../model/Category'

export const SET_CATEGORY_MAP = 'category/SET_CATEGORY_MAP'
export const UPDATE_CATEGORY = 'category/UPDATE_CATEGORY'
export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'
export const SET_ERROR_MESSAGE = 'category/SET_ERROR_MESSAGE'
export const CLEAR_ERROR_MESSAGE = 'category/CLEAR_ERROR_MESSAGE'
export const SET_SHOW_CATEGORY = 'category/SET_SHOW_CATEGORY'
export const CLEAR_SHOW_CATEGORY = 'category/CLEAR_SHOW_CATEGORY'
export const CREATE_CATEGORY = 'category/CREATE_CATEGORY'

const mutations = {
  [SET_CATEGORY_MAP](state, categories) {
    const categoryMap = {}
    categories.forEach(cat => {
      categoryMap[cat.id] = cat
    })
    state.categoryMap = categoryMap
  },

  [UPDATE_CATEGORY](state, category: CategoryView) {
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
  },

  [SET_SHOW_CATEGORY](state, id) {
    state.showCategory = id
  }, 

  [CLEAR_SHOW_CATEGORY](state) {
    state.showCategory = ""
  },

  [CREATE_CATEGORY](state, category: CategoryView) {
    const newMap = {}
    for(let id in state.categoryMap) {
      newMap[id] = state.categoryMap[id]
    }
    newMap[category.id] = category

    state.categoryMap = newMap
  }
}

export default mutations
