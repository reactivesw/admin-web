import Vue from 'vue'
import Component from 'vue-class-component'

import { FETCH_CATEGORIES } from './store/actions'
import { GET_CATEGORIES } from './store/getters'
import { ApiResult } from 'src/infrastructure/api_client'

@Component({
})
export default class CategoryTree extends Vue {

  created() {
    this.$store.dispatch(FETCH_CATEGORIES)
  }

  // the result could be undefined (still loading), error or data
  get fetchResult() {
    return this.$store.getters[GET_CATEGORIES]
  }

  get isLoading() {
    return this.fetchResult === undefined
  }

  get fetchError() {
    return this.fetchResult && this.fetchResult.error
  }

  get categories() {
    return this.fetchResult && this.fetchResult.data
  }
}