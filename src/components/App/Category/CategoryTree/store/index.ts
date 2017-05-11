import getters from './getters'
import mutations, { INITIAL_CATEGROIES_VALUE } from './mutations'
import actions from './actions'

const initialState = {
  categories: INITIAL_CATEGROIES_VALUE
}

export default {
  state: { ...initialState }, 
  getters,
  mutations,
  actions
}