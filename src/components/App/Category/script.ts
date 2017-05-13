import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories } from './api_client'
import { CategoryView } from './model/Category'

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

  // we return the sorted array
  get categories(): CategoryView[] | undefined {
    const result = this.apiResult
    if (result) {
      const data = result.data
      if (data) {
        let categories: CategoryView[] = data['results']
        return categories.sort((c1, c2) => {
          return parseFloat(c1.orderHint) - parseFloat(c2.orderHint)
        })
      }
    }
  }
}