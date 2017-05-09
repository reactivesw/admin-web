import Vue from 'vue'
import Component from 'vue-class-component'

import HomeHeader from 'src/components/App/HomeHeader'

@Component({
  components: {
    HomeHeader
  }
})
export default class App extends Vue {
}