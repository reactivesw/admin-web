import Vue from 'vue'
import Component from 'vue-class-component'

import { FETCH_CATEGORIES } from './store/actions'
import { GET_CATEGORIES } from './store/getters'
import { ApiResult } from 'src/infrastructure/api_client'

@Component({
})
export default class CategoryTree extends Vue {
  isLoading = true
  error: string | undefined = undefined

  created() {
    this.$store.dispatch(FETCH_CATEGORIES)
  }

  get categories() {
    let retVal: object | undefined = undefined
    const result: ApiResult = this.$store.getters[GET_CATEGORIES]
    if (result) {
      this.isLoading = false
      if (result.error) {
        this.error = result.error
      } else {
        retVal = result.data
      }
    }
    return retVal
  }
}