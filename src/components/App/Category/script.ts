import Vue from 'vue'
import Component from 'vue-class-component'

import CategoryTree from 'src/components/App/Category/CategoryTree'
import OneCategory from 'src/components/App/Category/OneCategory'

@Component({
  components: {
    CategoryTree,
    OneCategory
  }
})
export default class Category extends Vue {
  showCategoryTree = true
  showOneCategory = false
}