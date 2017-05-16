import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categories: null, // sorted categories
  categoryTree: null,
  categoryMap: null
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}