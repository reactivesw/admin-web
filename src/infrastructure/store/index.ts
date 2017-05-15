import Vue from 'vue'
import Vuex from 'vuex'

import category from 'src/components/App/Category/store'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    category
  },
  strict: debug
})

export default store
