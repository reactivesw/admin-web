export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'
export const INITIAL_DISABLE_SELECTS_VALUE = false

const mutations = {
  [SET_DISABLE_SELECTS](state, flag) {
    state.disableSelects = flag
  }
}

export default mutations