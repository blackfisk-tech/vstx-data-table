<template lang="pug">
  span.default(@mouseenter="expandText", @mouseleave="shrinkText") {{ getText }}
</template>

<script>
export default {
  name: 'data-table-cell-default',
  props: {
    text: [String, Number],
    maxLength: Number
  },
  data () {
    return {
      isHovered: false
    }
  },
  computed: {
    getText () {
      if (this.isHovered) {
        return this.text
      } else {
        return (this.text.length > this.maxLength ? `${this.text.substring(0, this.maxLength)}...` : this.text)
      }
    }
  },
  methods: {
    expandText () {
      this.isHovered = true
    },
    shrinkText () {
      this.isHovered = false
    }
  }
}
</script>

<style lang="stylus">
</style>
