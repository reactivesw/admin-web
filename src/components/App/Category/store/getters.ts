export const GET_DISABLE_SELECTS = 'category/GET_DISABLE_SELECTS'

const getters = {
  [GET_DISABLE_SELECTS](state) {
    return state.disableSelects
  }
}

export default getters