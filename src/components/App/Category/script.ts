import Vue from 'vue'
import Component from 'vue-class-component'

import { formatError } from 'src/infrastructure/api_client'
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

  isCreating: boolean = false
  draft: any = {}  // cannot be undefined to be reactive
  isSaving: boolean = false // is saving in progress
  isLoading: boolean = false

  async created() {
    this.$store.registerModule(CATEGORY_STORE_NAME, Store)

    try {
      this.isLoading = true
      const response = await getCategories()
      this.$store.commit(SET_CATEGORY_MAP, response.data['results'])
    } catch (error) {
      this.$store.commit(SET_ERROR_MESSAGE, formatError(error))
    } 

    this.isLoading = false
  }

  destroyed() {
    this.$store.unregisterModule(CATEGORY_STORE_NAME)
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
    try {
    const response = await createCategory(draft)
    this.$store.commit(CREATE_CATEGORY, response.data)
      this.isCreating = false
    } catch (error) {
      // stay in creation mode if there is an error
      this.$store.commit(SET_ERROR_MESSAGE, formatError(error))
    } 
    this.isSaving = false
  }

  cancelCategory() {
    this.isCreating = false
  }
}
