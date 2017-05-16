import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    errorMessage: String
  }
})
export default class ErrorMessager extends Vue {
  errorMessage: string

  closeErrorMessage() {
    this.$emit('CloseErrorEvent')
  }
}