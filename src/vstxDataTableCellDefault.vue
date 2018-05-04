<template lang="pug">
  //- span.default(@mouseenter="expandText", @mouseleave="shrinkText") {{ getText }}
  span.default() {{ getText }}
</template>

<script>
import { delay, isNil } from 'lodash'
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
      } else if (!isNil(this.text)) {
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
