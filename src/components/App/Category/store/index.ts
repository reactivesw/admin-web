import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categoryMap: null,
  errorMessage: null,
  showCategory: "",
  languages: {
    en: "English",
    zh_cn: "简体中文"
  }
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}