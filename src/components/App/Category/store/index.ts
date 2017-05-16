import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categoryMap: null,
  errorMessage: null
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}