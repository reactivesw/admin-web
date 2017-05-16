import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories } from './api_client'

import { SET_CATEGORY_MAP, SET_ERROR_MESSAGE, CLEAR_ERROR_MESSAGE } 
  from './store/mutations'
import { GET_CATEGORY_MAP, GET_ERROR_MESSAGE } from './store/getters'

import CategoryNode from './model/CategoryNode'
import { CategoryView, CategoryMap, DummyCategoryView } from './model/Category'
import { buildChildNodes, addChildren } from './model/utilities'

import TreeNode from 'src/components/App/Category/TreeNode'
import ErrorMessage from 'src/components/App/Category/ErrorMessage'

@Component({
  components: {
    TreeNode,
    ErrorMessage
  }
})
export default class Category extends Vue {
  // !  a property is NOT reactive if it its initial value is 'undefined
  apiResult: ApiResult | null = null

  async created() {
    this.apiResult = await getCategories()
    if (this.apiResult) {
      if (this.apiResult.error) {
        this.$store.commit(SET_ERROR_MESSAGE, this.apiResult.error)
      } else {
        this.$store.commit(SET_CATEGORY_MAP, this.apiResult.data['results'])
      }
    }
  }

  get isLoading() {
    return this.apiResult === null
  }

  get errorMessage() {
    return this.$store.getters[GET_ERROR_MESSAGE]
  }

  closeErrorMessage() {
    this.$store.commit(CLEAR_ERROR_MESSAGE)
  }

  get categoryMap(): CategoryMap {
    return this.$store.getters[GET_CATEGORY_MAP]
  }

  get virtualRoot(): CategoryNode {
    const virtualRoot: CategoryNode = new CategoryNode(DummyCategoryView)
    addChildren(virtualRoot, this.categoryMap)
    return virtualRoot
  }

  get childNodes(): CategoryNode[] {
    return buildChildNodes(this.virtualRoot, this.categoryMap)
  }
}

