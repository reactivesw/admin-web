import Vue from 'vue'
import Component from 'vue-class-component'

import { ApiResult } from 'src/infrastructure/api_client'
import { getCategories, createCategory } from './api_client'

import Store, { CATEGORY_STORE_NAME } from 'src/components/App/Category/store'
import { SET_CATEGORY_MAP, SET_ERROR_MESSAGE, 
  CLEAR_ERROR_MESSAGE, CREATE_CATEGORY }
  from './store/mutations'
import { GET_CATEGORY_MAP, GET_ERROR_MESSAGE, GET_SHOW_CATEGORY } from './store/getters'

import CategoryNode from './model/CategoryNode'
import {
  CategoryView, CategoryMap,
  DummyCategoryView, getEmptyCategoryDraft
} from './model/Category'
import { buildChildNodes, addChildren } from './model/utilities'

import TreeNode from 'src/components/App/Category/TreeNode'
import ErrorMessage from 'src/components/App/Category/ErrorMessage'
import ShowCategory from 'src/components/App/Category/ShowCategory'
import CategoryDetail from 'src/components/App/Category/shared/CategoryDetail'

@Component({
  components: {
    TreeNode,
    ErrorMessage,
    ShowCategory,
    CategoryDetail
  }
})
export default class Category extends Vue {
  // !  a property is NOT reactive if it its initial value is 'undefined
  apiResult: ApiResult | null = null

  isCreating: boolean = false
  draft: any = {}  // cannot be undefined to be reactive
  isSaving: boolean = false // is saving in progress

  async created() {
    this.$store.registerModule(CATEGORY_STORE_NAME, Store)

    this.apiResult = await getCategories()
    if (this.apiResult) {
      if (this.apiResult.error) {
        this.$store.commit(SET_ERROR_MESSAGE, this.apiResult.error)
      } else {
        this.$store.commit(SET_CATEGORY_MAP, this.apiResult.data['results'])
      }
    }
  }

  destroyed() {
    this.$store.unregisterModule(CATEGORY_STORE_NAME)
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

  get showCategory(): string {
    return this.$store.getters[GET_SHOW_CATEGORY]
  }

  createCategory() {
    this.draft = getEmptyCategoryDraft()
    this.isCreating = true
  }

  async saveCategory(draft) {
    this.isSaving = true

    this.$store.commit(CLEAR_ERROR_MESSAGE) // just in case
    const result: ApiResult = await createCategory(draft)
    if (result.error) {
      // stay in creation mode if there is an error
      this.$store.commit(SET_ERROR_MESSAGE, result.error)
    } else {
      this.$store.commit(CREATE_CATEGORY, result.data)
      this.isCreating = false
    }
    this.isSaving = false
  }

  cancelCategory() {
    this.isCreating = false
  }

}
