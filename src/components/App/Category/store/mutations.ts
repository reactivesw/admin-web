export const SET_CATEGORIES = 'category/SET_CATEGORIES'
export const INITIAL_CATEGROIES_VALUE = undefined

const mutations = {
  [SET_CATEGORIES](state, categories) {
    state.categories = categories
  }
}

export default mutations
