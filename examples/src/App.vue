<template lang="pug">
  .wrapper(id="app")
    .columns
      .column
        BootstrapExample
</template>

<script>
import BootstrapExample from './components/BootstrapExample.vue'

export default {
  name: 'app',
  components: {
    BootstrapExample
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
