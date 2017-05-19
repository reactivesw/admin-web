import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryDraft } from '../../model/Category'
import { GET_LANGUAGE_SETTING } from '../../store/getters'

@Component({
  props: {
    category: Object,
    isReadOnly: Boolean, 
    isSaving: Boolean
  }
})
export default class CategoryDetail extends Vue {
  category: CategoryDraft  
  isReadOnly: boolean
  isSaving: boolean

  // default language id
  langId: string = ""

  draft:any = {}

  created() {
    this.langId = this.languageSetting.default
    cloneData(this)
  }

  get languageSetting() {
    return this.$store.getters[GET_LANGUAGE_SETTING]
  }
  get languages() {
    return this.languageSetting.languages
  }

  cancelEdit() {
    cloneData(this)
    this.$emit("CategoryCancelEvent")
  }

  saveCategory() {
    this.$emit("CategorySaveEvent", this.draft)
  }
}

function cloneData(component: CategoryDetail) {
  const category = component.category
  const draft = component.draft
  draft.name = Object.assign({}, category.name)
  draft.description = Object.assign({}, category.description)

  draft.slug = category.slug
  draft.externalId = category.externalId ? category.externalId : ""

  draft.metaTitle = Object.assign({}, category.metaTitle)
  draft.metaDescription = Object.assign({}, category.metaDescription)
  draft.metaKeywords = Object.assign({}, category.metaKeywords)
}