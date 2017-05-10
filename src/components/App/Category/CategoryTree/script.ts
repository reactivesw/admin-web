import Vue from 'vue'
import Component from 'vue-class-component'

import { FETCH_CATEGORIES } from './store/actions'
import { GET_CATEGORIES } from './store/getters'
@Component({
})
export default class CategoryTree extends Vue {
  isLoading = true
  netError = null

  created() {
    this.isLoading = true
    this.$store.dispatch(FETCH_CATEGORIES)
  }

  get categories() {
    const netData = this.$store.getters[GET_CATEGORIES]
    if (netData) {
      this.isLoading = false
    }  
    return netData
  }
}