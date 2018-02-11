<template lang="pug">
span.data-table-cell
  slot
    span
      //- Link
      div(v-if="getColumn['type'] === 'link' && item['type'] !== 'total'")
        a.cell--link(:href="replaceLink(getColumn['link'], getColumn['linkReplaceText'], getColumn['linkReplaceField'])", :target="getColumn['target']") {{ applyFilter(item[getColumn['field']], getColumn['format']) }}
      //- Filter
      div(v-else-if="getColumn['type'] === 'filter'")
        a.cell--link(@click.prevent="emitFilter(applyFilter(item[getColumn['field']], getColumn['format'], ...getColumn['formatArgs']), getColumn['field'])") {{ applyFilter(item[getColumn['field']], getColumn['format']) }}
      //- Hover/Click Events
      div(v-else-if="getColumn['type'] === 'event'")
        a.cell--link(
          @hover.prevent="getColumn['onHover'] === true ? emitEvent(item[getColumn['eventName']], item[getColumn['eventPayload']], item[getColumn['eventBus']]) : ''",
          @click.prevent="getColumn['onClick'] === true ? emitEvent(item[getColumn['eventName']], item[getColumn['eventPayload']], item[getColumn['eventBus']]) : ''"
        ) {{ applyFilter(item[getColumn['field']], getColumn['format'], ...getColumn['formatArgs']) }}
      //- Total
      div(v-else-if="item['type'] === 'total'"): strong {{ applyFilter(item['value'], getColumn['format'], ...getColumn['formatArgs']) }}
      template(v-else="")
        data-table-cell-default(:text="applyFilter(item[getColumn['field']], getColumn['format'], ...getColumn['formatArgs'])", :maxLength="125")

</template>

<script>
import accounting from 'accounting'
import moment from 'moment'
import { isNil, forEach, round } from 'lodash'
import DataTableCellDefault from './vstxDataTableCellDefault.vue'

export default {
  name: 'data-table-cell',
  components: {
    'data-table-cell-default': DataTableCellDefault
  },
  filters: {
    formatNumber: (num) => {
      return accounting.formatNumber(num)
    },
    formatMoney: (num) => {
      return accounting.formatMoney(num)
    },
    formatPercent: (num) => {
      return `${num.toFixed(2)}%`
    },
    formatString: (string) => {
      return string
    },
    formatDate: (string = '', format = 'YYYY-MM-DD HH:mm', offset = '+0000') => {
      return moment(string).utcOffset(offset).format(format)
    }
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
    applyFilter (items, name, ...args) {
      if (isNil(name) || name === '' || isNil(items) || items === '') {
        return items
      } else if (name in this.$options.filters) {
        return this.$options.filters[name](items, ...args)
      } else if (name in this.$root.$options.filters) {
        return this.$root.$options.filters[name](items, ...args)
      } else {
        return items
      }
    },
    replaceLink (link, text, val) {
      forEach(text, (chunk, i) => {
        link = link.replace(text[i], this.item[val[i]])
      })
      return link
    }
  }
}
</script>

<style lang="stylus">
</style>
