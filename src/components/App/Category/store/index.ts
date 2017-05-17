import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categoryMap: null,
  errorMessage: null,
  showCategory: ""
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}