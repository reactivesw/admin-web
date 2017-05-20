import getters from './getters'
import mutations from './mutations'

const initialState = {
  disableSelects : false,
  categoryMap: null,
  errorMessage: null,
  showCategory: "",
  languageSetting: {
    default: "en",
    languages: {
      en: "English",
      zh_cn: "简体中文"
    }
  }
}

export default {
  state: { ...initialState }, 
  getters,
  mutations
}

export const CATEGORY_STORE_NAME = 'category'