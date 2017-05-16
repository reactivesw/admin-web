import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categoryMap: null
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}