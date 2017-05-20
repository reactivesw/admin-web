import Vue from 'vue'
import Component from 'vue-class-component'

import {
  CategoryDraft, CategoryView,
  getEmptyCategoryDraft, Reference
} from '../model/Category'
import {
  CLEAR_SHOW_CATEGORY, SET_ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE, UPDATE_CATEGORY,
  CREATE_CATEGORY, DELETE_CATEGORY
}
  from '../store/mutations'

import { isSameLocalStr, isSameJsonStr } from '../model/Category'
import {
  Action, buildSetNameAction, buildSetDescriptionAction,
  buildSetExternalId, buildSetMetaDescription,
  buildSetMetaKeywords, buildSetMetaTitle,
  buildSetSlug, buildArgs
}
  from '../model/UpdateCategory'

import { ApiResult } from 'src/infrastructure/api_client'
import { updateCategory, createCategory, deleteCategory } from '../api_client'

import CategoryDetail from 'src/components/App/Category/shared/CategoryDetail'

@Component({
  props: {
    category: Object
  },
  components: {
    CategoryDetail
  }
})
export default class ShowCategory extends Vue {
  category: CategoryView

  // cannot be undefined to be reactive
  draft: CategoryDraft = buildDraft(this.category)  

  // not in editing mode
  isUpdating: boolean = false

  // is saving to backend
  // only affect cancel and save button
  isSaving: boolean = false
  isCreating: boolean = false
  isDeleting: boolean = false

  backToCategories() {
    this.$store.commit(CLEAR_SHOW_CATEGORY)
  }

  enableEdit() {
    this.isUpdating = true
  }

  get isOperationDisabled() {
    // disable operations in updating and deleting modes
    return this.isUpdating || this.isDeleting
  }

  createCategory() {
    this.isCreating = true
    this.isUpdating = true
    this.draft = getEmptyCategoryDraft()
  }

  async saveCategory(draft) {
    this.isSaving = true

    if (this.isCreating) {
      await processCreation(this, draft)
    } else {
      await processUpdate(this, draft)
    }

    this.isSaving = false
  }

  async deleteCategory() {
    this.isDeleting = true

    this.$store.commit(CLEAR_ERROR_MESSAGE) // just in case

    const result: ApiResult = await deleteCategory(this.category.id, this.category.version)
    if (result.error) {
      // stay in initial mode if there is an error
      this.$store.commit(SET_ERROR_MESSAGE, result.error)
      this.isDeleting = false
    } else {
      this.$store.commit(DELETE_CATEGORY, this.category.id)
      this.$store.commit(CLEAR_SHOW_CATEGORY)
    }
  }

  cancelCategory() {
    this.isCreating = false
    this.isUpdating = false
    this.draft = buildDraft(this.category)
  }
}

function buildDraft(category: CategoryView): CategoryDraft {
  const draft: any = {}
  draft.name = Object.assign({}, category.name)
  draft.description = Object.assign({}, category.description)

  draft.slug = category.slug
  draft.externalId = category.externalId ? category.externalId : ""

  draft.metaTitle = Object.assign({}, category.metaTitle)
  draft.metaDescription = Object.assign({}, category.metaDescription)
  draft.metaKeywords = Object.assign({}, category.metaKeywords)
  return draft
}

async function processCreation(component: ShowCategory, draft) {
  draft.parent = {
    typeId: 'category',
    id: component.category.id
  }

  component.$store.commit(CLEAR_ERROR_MESSAGE) // just in case
  const result: ApiResult = await createCategory(draft)
  if (result.error) {
    // stay in creation mode if there is an error
    component.$store.commit(SET_ERROR_MESSAGE, result.error)
  } else {
    component.$store.commit(CREATE_CATEGORY, result.data)
    component.$store.commit(CLEAR_SHOW_CATEGORY)
  }
}

async function processUpdate(component: ShowCategory, draft) {
  const args = buildUpdateArgs(component.category, draft)
  if (args) {
    component.$store.commit(CLEAR_ERROR_MESSAGE) // just in case
    const result: ApiResult = await updateCategory(args)
    if (result.error) {
      // stay in edit mode if there is an error
      component.$store.commit(SET_ERROR_MESSAGE, result.error)
    } else {
      component.$store.commit(UPDATE_CATEGORY, result.data)
      component.isUpdating = false
    }
  } else {
    component.isUpdating = false
  }
}

function buildUpdateArgs(category: CategoryView, draft: CategoryDraft) {
  let args
  const actions: Action[] = []
  if (!isSameLocalStr(draft.name, category.name)) {
    actions.push(buildSetNameAction(draft.name))
  }

  if (draft.description && !isSameLocalStr(draft.description, category.description)) {
    actions.push(buildSetDescriptionAction(draft.description))
  }

  // it doesn't matter to send an empty for undefined
  if (draft.externalId !== undefined && !isSameJsonStr(draft.externalId, category.externalId)) {
    actions.push(buildSetExternalId(draft.externalId))
  }

  if (draft.metaDescription && !isSameLocalStr(draft.metaDescription, category.metaDescription)) {
    actions.push(buildSetMetaDescription(draft.metaDescription))
  }

  if (draft.metaKeywords && !isSameLocalStr(draft.metaKeywords, category.metaKeywords)) {
    actions.push(buildSetMetaKeywords(draft.metaKeywords))
  }

  if (draft.metaTitle && !isSameLocalStr(draft.metaTitle, category.metaTitle)) {
    actions.push(buildSetMetaTitle(draft.metaTitle))
  }

  if (draft.slug !== undefined && !isSameJsonStr(draft.slug, category.slug)) {
    actions.push(buildSetSlug(draft.slug))
  }

  if (actions.length > 0) {
    args = buildArgs(category.id, category.version, actions)
  }
  return args
}