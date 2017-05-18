import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryView } from '../model/Category'
import {
  CLEAR_SHOW_CATEGORY, SET_ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE, UPDATE_CATEGORY
}
  from '../store/mutations'
import { GET_LANGUAGES } from '../store/getters'

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

@Component({
  props: {
    category: Object
  }
})
export default class ShowCategory extends Vue {
  category: CategoryView

  isReadOnly: boolean = true
  langId: string = "en"

  name: Object = {}
  description: Object = {}
  slug: string = ""
  externalId: string = ""
  metaTitle: Object = {}
  metaDescription: Object = {}
  metaKeywords: Object = {}

  created() {
    this.name = Object.assign({}, this.category.name)
    this.description = Object.assign({}, this.category.description)

    this.slug = this.category.slug
    this.externalId = this.category.externalId ? this.category.externalId : ""

    this.metaTitle = Object.assign({}, this.category.metaTitle)
    this.metaDescription = Object.assign({}, this.category.metaDescription)
    this.metaKeywords = Object.assign({}, this.category.metaKeywords)
  }

  backToCategories() {
    this.$store.commit(CLEAR_SHOW_CATEGORY)
  }

  get languages() {
    return this.$store.getters[GET_LANGUAGES]
  }

  get langIds() {
    const ids: string[] = []
    for (let id in this.languages) {
      ids.push(id)
    }
    return ids
  }

  enableEdit() {
    this.isReadOnly = false
  }

  async saveCategory() {
    const args = buildUpdateArgs(this)
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
    
  }

  cancelEdit() {
    cloneData(this)
    this.isReadOnly = true
  }
}

function cloneData(component: ShowCategory) {
  const category = component.category
  component.name = Object.assign({}, category.name)
  component.description = Object.assign({}, category.description)

  component.slug = category.slug
  component.externalId = category.externalId ? category.externalId : ""

  component.metaTitle = Object.assign({}, category.metaTitle)
  component.metaDescription = Object.assign({}, category.metaDescription)
  component.metaKeywords = Object.assign({}, category.metaKeywords)
}

function buildUpdateArgs(component: ShowCategory) {
  let args
  const actions: Action[] = []
  const category = component.category
  if (!isSameLocalStr(component.name, category.name)) {
    actions.push(buildSetNameAction(component.name))
  }

  if (!isSameLocalStr(component.description, category.description)) {
    actions.push(buildSetDescriptionAction(component.description))
  }

  // it doesn't matter to send an empty for undefined
  if (!isSameJsonStr(component.externalId, category.externalId)) {
    actions.push(buildSetExternalId(component.externalId))
  }

  if (!isSameLocalStr(component.metaDescription, category.metaDescription)) {
    actions.push(buildSetMetaDescription(component.metaDescription))
  }

  if (!isSameLocalStr(component.metaKeywords, category.metaKeywords)) {
    actions.push(buildSetMetaKeywords(component.metaKeywords))
  }

  if (!isSameLocalStr(component.metaTitle, category.metaTitle)) {
    actions.push(buildSetMetaTitle(component.metaTitle))
  }

  if (!isSameJsonStr(component.slug, category.slug)) {
    actions.push(buildSetSlug(component.slug))
  }

  if (actions.length > 0) {
    args = buildArgs(component.category.id, component.category.version, actions)
  }
  return args
}
