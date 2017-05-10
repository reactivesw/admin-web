import Vue from 'vue'
import Vuex from 'vuex'

import category_tree from 'src/components/App/Category/CategoryTree/store'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    category_tree
  },
  strict: debug
})

export default store
