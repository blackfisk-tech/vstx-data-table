<template lang="pug">
  span.default(@mouseenter="expandText", @mouseleave="shrinkText") {{ getText }}
</template>

<script>
import {delay} from 'lodash'
export default {
  name: 'data-table-cell-default',
  props: {
    text: {
      required: true
    },
    maxLength: Number
  },
  data () {
    return {
      isHovered: false,
      mouseInTimer: '',
      mouseOutTimer: ''
    }
  },
  computed: {
    getText () {
      if (this.isHovered) {
        return this.text
      } else if (this.text !== null && this.text !== undefined) {
        return (this.text.length > this.maxLength ? `${this.text.substring(0, this.maxLength)}...` : this.text)
      } else {
        return ''
      }
    }
  },
  methods: {
    expandText () {
      this.mouseInTimer = delay(() => {
        this.isHovered = true
      }, 250)
    },
    shrinkText () {
      this.mouseOutTimer = delay(() => {
        clearTimeout(this.mouseInTimer)
        this.isHovered = false
      }, 750)
    }
  }
}
</script>

<style lang="stylus">
</style>
