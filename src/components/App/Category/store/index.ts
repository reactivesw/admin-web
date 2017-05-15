import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,  
  orderHintCategory: null
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}