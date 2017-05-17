import Vue from 'vue'
import Component from 'vue-class-component'

import { CategoryView } from '../model/Category'
import { CLEAR_SHOW_CATEGORY } from '../store/mutations'


@Component({
  props: {
    category: Object
  }
})
export default class ShowCategory extends Vue {
  category: CategoryView

  backToCategories() {
    this.$store.commit(CLEAR_SHOW_CATEGORY)
  }
}