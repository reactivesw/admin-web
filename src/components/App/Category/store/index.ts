import getters from './getters'
import mutations, { INITIAL_DISABLE_SELECTS_VALUE } from './mutations'


const initialState = {
  disableSelects : INITIAL_DISABLE_SELECTS_VALUE,  
  orderHintCategory: null
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}