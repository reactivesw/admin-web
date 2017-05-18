import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryView } from '../model/Category'
import { CLEAR_SHOW_CATEGORY } from '../store/mutations'
import { GET_LANGUAGES } from '../store/getters'

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
    this.externalId = this.category.externalId? this.category.externalId: ""

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
}