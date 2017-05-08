<template>
  <div id="app" class="container-fluid">
    <i class="fa fa-space-shuttle fa-5x"></i>
    <hello></hello>
  </div>
</template>

<script lang="ts">
import Hello from 'src/components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

