import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories } from './api_client'

import { SET_CATEGORY_TREE } from './store/mutations'
import { GET_CATEGORY_TREE } from './store/getters'

import TreeNode from 'src/components/App/Category/TreeNode'

@Component({
  components: {
    TreeNode
  }
})
export default class Category extends Vue {
  // !  a property is NOT reactive if it its initial value is 'undefined
  apiResult: ApiResult | null = null

  async created() {
    this.apiResult = await getCategories()
    if (this.apiResult && this.apiResult.data) {
      this.$store.commit(SET_CATEGORY_TREE, this.apiResult.data['results'])
    }
  }

  get isLoading() {
    return this.apiResult === null
  }

  get fetchError() {
    if (this.apiResult) {
      return this.apiResult.error
    }
  }

  get virtualRoot() {
    return this.$store.getters[GET_CATEGORY_TREE]
  }
}