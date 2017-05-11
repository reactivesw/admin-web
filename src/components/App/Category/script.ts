import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories } from './api_client'

import CategoryTree from 'src/components/app/Category/CategoryTree'

@Component({
  components: {
    CategoryTree
  }
})
export default class Category extends Vue {
  // !  vue-class-component does not make a property reactive 
  // if it has undefined as initial value
  apiResult: ApiResult | null = null

  async created() {
    this.apiResult = await getCategories()
  }

  get isLoading() {
    return this.apiResult === null
  }

  get fetchError() {
    const result = this.apiResult
    if (result) {
      return result.error
    }
  }

  get categories() {
    const result = this.apiResult
    if (result) {
      return result.data
    }
  }
}