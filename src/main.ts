// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './infrastructure/store'
import App from 'src/components/App'

import 'bootstrap/dist/js/bootstrap'
import './styles/style.scss'

Vue.config.productionTip = false

import setLocales from './infrastructure/i18n'
setLocales(Vue)

import router from './infrastructure/router'

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
})
