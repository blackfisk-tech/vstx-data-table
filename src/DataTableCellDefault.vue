<template lang="pug">
  span.default(@mouseenter="expandText", @mouseleave="shrinkText") {{ getText }}
</template>

<script>
import {delay} from 'lodash'
export default {
  name: 'data-table-cell-default',
  props: {
    text: [String, Number, Object],
    maxLength: Number
  },
  data () {
    return {
      isHovered: false,
      timer: ''
    }
  },
  computed: {
    getText () {
      if (this.isHovered) {
        return this.text
      } else if (this.text !== null) {
        return (this.text.length > this.maxLength ? `${this.text.substring(0, this.maxLength)}...` : this.text)
      } else {
        return ''
      }
    }
  },
  methods: {
    expandText () {
      this.timer = delay(() => {
        this.isHovered = true
      }, 250)
    },
    shrinkText () {
      clearTimeout(this.timer)
      this.isHovered = false
    }
  }
}
</script>

<style lang="stylus">
</style>
