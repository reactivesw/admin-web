import Vue from 'vue'
import VueI18n from 'vue-i18n'

export default function (Vue) {
  Vue.use(VueI18n)
  loadLocales(Vue)
  customizeTranslation(Vue)
  initLang()
}

export function changeLang(newLang) {
  Vue.config['lang'] = newLang
  localStorage.setItem('lang', newLang)
}

/**
 * change lang according to localStorage
 */
function initLang() {
  const lang = localStorage.getItem('lang')
  if (lang) changeLang(lang.toLowerCase())
}

function loadLocales(Vue) {
  let en = require(`./en.json`)
  let locales = { en }

  // set lang context
  Object.keys(locales).forEach(key => {
    Vue.locale(key, locales[key])
  })
}

/**
 * We need to handle dynamic localized strings retrieved from
 * a backend server. The dynamic localized string has a format of
 * {'language_id1': 'localized_value1', 'language_id2': 'localized_value2' }.
 * We customize the standard '$t' to handle this data type.
 * @param Vue The Vue instance
 */
function customizeTranslation(Vue) {
  let oldT = Vue.prototype['$t']

  Vue.prototype['$t'] = function (this: Vue.Component, key, ...args) {
    let result
    if (typeof key === 'object') {
      result = key[Vue.config['lang']]
      if (!result) {
        result = key[Vue.config['fallbackLang']]
      }
    } else {
      result = oldT.call(this, key, ...args)
    }
    return result
  }
}
