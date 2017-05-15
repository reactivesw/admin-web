export const GET_CATEGORY_TREE = 'category/GET_CATEGORY_TREE'
export const GET_DISABLE_SELECTS = 'category/GET_DISABLE_SELECTS'

const getters = {
  [GET_CATEGORY_TREE](state) {
    return state.categoryTree
  },

  [GET_DISABLE_SELECTS](state) {
    return state.disableSelects
  }
}

export default getters