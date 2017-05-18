export const GET_CATEGORY_MAP = 'category/GET_CATEGORY_MAP'
export const GET_DISABLE_SELECTS = 'category/GET_DISABLE_SELECTS'
export const GET_ERROR_MESSAGE = 'category/GET_ERROR_MESSAG'
export const GET_SHOW_CATEGORY = 'category/GET_SHOW_CATEGORY'
export const GET_LANGUAGES = 'category/GET_LANGUAGES'

const getters = {

  [GET_CATEGORY_MAP](state) {
    return state.categoryMap
  },

  [GET_DISABLE_SELECTS](state) {
    return state.disableSelects
  }, 

  [GET_ERROR_MESSAGE](state) {
    return state.errorMessage
  },

  [GET_SHOW_CATEGORY](state) {
    return state.showCategory
  },

  [GET_LANGUAGES](state) {
    return state.languages
  }
}

export default getters
