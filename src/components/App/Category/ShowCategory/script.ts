import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryDraft, CategoryView } from '../model/Category'
import {
  CLEAR_SHOW_CATEGORY, SET_ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE, UPDATE_CATEGORY
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
import { updateCategory } from '../api_client'

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

  // not in editing mode
  isReadOnly: boolean = true

  // is saving to backend
  // only affect cancel and save button
  isSaving: boolean = false

  backToCategories() {
    this.$store.commit(CLEAR_SHOW_CATEGORY)
  }

  enableEdit() {
    this.isReadOnly = false
  }

  async saveCategory(draft: CategoryDraft) {
    this.isSaving = true

    const args = buildUpdateArgs(this.category, draft)
    if (args) {
      this.$store.commit(CLEAR_ERROR_MESSAGE) // just in case
      const result: ApiResult = await updateCategory(args)
      if (result.error) {
        // stay in edit mode if there is an error
        this.$store.commit(SET_ERROR_MESSAGE, result.error)
      } else {
        this.$store.commit(UPDATE_CATEGORY, result.data)
        this.isReadOnly = true
      }
    } else {
      this.isReadOnly = true
    }
    this.isSaving = false
  }

  cancelCategory() {
    this.isReadOnly = true
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
