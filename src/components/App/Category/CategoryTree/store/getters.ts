export const GET_CATEGORIES = 'categoryTree/GET_CATEGORIES'

const getters = {
  [GET_CATEGORIES](state) {
    return state.categories
  }
}

export default getters
