<template lang="pug">
span.data-table-cell
  slot
    span
      //- Link
      div(v-if="getColumn['type'] === 'link' && !edit && item['type'] !== 'total'")
        a.cell--link(:href="replaceLink(getColumn['link'], getColumn['linkReplaceText'], getColumn['linkReplaceField'])", :target="getColumn['target']") {{ applyFilter(item[getColumn['field']], getColumn['format']) }}
      //- Filter
      div(v-else-if="getColumn['type'] === 'filter'")
        a.cell--link(@click.prevent="emitFilter(applyFilter(item[getColumn['field']], getColumn['format']), getColumn['field'])") {{ applyFilter(item[getColumn['field']], getColumn['format']) }}
      //- Hover/Click Events
      div(v-else-if="getColumn['type'] === 'event'")
        a.cell--link(
          @hover.prevent="getColumn['onHover'] === true ? emitEvent(item[getColumn['eventName']], item[getColumn['eventPayload']], item[getColumn['eventBus']]) : ''",
          @click.prevent="getColumn['onClick'] === true ? emitEvent(item[getColumn['eventName']], item[getColumn['eventPayload']], item[getColumn['eventBus']]) : ''"
        ) {{ applyFilter(item[getColumn['field']], getColumn['format']) }}
      //- Editable Total
      div.field.is-narrow(v-else-if="editable && edit && item['type'] !== 'total'")
        input.input(:value.number="item[getColumn['field']]", @input="update")
      //- Total
      div(v-else-if="item['type'] === 'total'"): strong {{ applyFilter(item['value'], getColumn['format']) }}
      template(v-else="")
        data-table-cell-default(:text="applyFilter(item[getColumn['field']], getColumn['format'])", :maxLength="125")

</template>

<script>
import { debounce } from 'lodash'
import DataTableCellDefault from './DataTableCellDefault.vue'

export default {
  name: 'data-table-cell',
  components: {
    'data-table-cell-default': DataTableCellDefault
  },
  props: {
    column: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    editable: {
      type: Boolean,
      required: false,
      default: false
    },
    edit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    getColumn () {
      return this.column
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    emitEvent (eventName = '', eventPayload = {}, eventBus = false) {
      if (eventName.length) {
        if (eventBus) {
          this.$bus.$emit(eventName, eventPayload)
        } else {
          this.$emit(eventName, eventPayload)
        }
      }
    },
    emitFilter (search, column) {
      this.$emit('onFilter', {
        search,
        column
      })
    },
    applyFilter (items, name) {
      if (name === undefined || name === null || name === '' || items === '') {
        return items
      }
      return this.$root.$options.filters[name](items)
    },
    replaceLink (link, text, val) {
      for (var i = 0; i < text.length; i++) {
        link = link.replace(text[i], this.item[val[i]])
      }

      return link
    },
    update: debounce((e) => {
      this.value = e.target.value
    }, 500)
  }
}
</script>

<style lang="stylus">
</style>
