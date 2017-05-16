import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories } from './api_client'

import { SET_CATEGORY_MAP } from './store/mutations'
import { GET_CATEGORY_MAP } from './store/getters'

import CategoryNode from './model/CategoryNode'
import { CategoryView, CategoryMap, DummyCategoryView } from './model/Category'
import { buildChildNodes, addChildren } from './model/utilities'

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
      this.$store.commit(SET_CATEGORY_MAP, this.apiResult.data['results'])
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

