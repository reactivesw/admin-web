import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryDraft } from '../../model/Category'
import { GET_LANGUAGE_SETTING } from '../../store/getters'

@Component({
  props: {
    draft: Object,
    isCreation: Boolean,
    isReadOnly: Boolean, 
    isSaving: Boolean
  }
})
export default class CategoryDetail extends Vue {
  draft: CategoryDraft
  isCreation: boolean 
  isReadOnly: boolean
  isSaving: boolean

  get languageSetting() {
    return this.$store.getters[GET_LANGUAGE_SETTING]
  }
  get langId() {
    return this.languageSetting.default
  }
  get languages() {
    return this.languageSetting.languages
  }

  cancelEdit() {
    this.$emit('CategoryCancelEvent')
  }

  saveCategory() {
    this.$emit('CategorySaveEvent', this.draft)
  }
}
