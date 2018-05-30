<template lang="pug">
  .wrapper(id="app")
    .columns
      .column
        BulmaExample
</template>

<script>
import BulmaExample from './components/BulmaExample.vue'

export default {
  name: 'app',
  components: {
    BulmaExample
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
