import { findIndex, indexOf, forEach, isNil } from 'lodash'

/*
  SELECT MIXIN
  ============
  Uses the checkbox elements built into the data-table to manage the state of selected rows.
  Emits event: [ onSelect ] with payload of state.selected when one or more items is selected.
*/

export const selectMixin = {
  data () {
    return {
      state: {
        selected: [],
        isSelectAll: false
      }
    }
  },
  computed: {
    getSelected () {
      return this.state.selected
    }
  },
  methods: {
    select (item) {
      let payloadIndex = findIndex(this.payload, item)
      let selectedIndex = indexOf(this.state.selected, payloadIndex)
      if (this.isSelected(item)) {
        this.state.selected.splice(selectedIndex, 1)
      } else {
        this.state.selected.push(payloadIndex)
      }
      this.$emit('onSelect', this.state.selected)
    },
    isSelected (item) {
      // If in Selections
      let payloadIndex = findIndex(this.payload, item)
      let isSelected = indexOf(this.state.selected, payloadIndex)
      if (isSelected === -1) {
        return false
      } else {
        return true
      }
    },
    selectAll (e) {
      // 'Select All in Page' vs 'Select All in Data' UX
      if (e.target.checked) {
        let data = this.getData
        forEach(data, (row) => {
          if (!this.isSelected(row)) {
            this.select(row)
          }
        })
      } else {
        this.state.selected = []
      }
      this.$emit('onSelect', this.state.selected)
    },
    clearSelects () {
      this.state.isSelectAll = false
      this.state.selected = []
    },
    isAltered (item) {
      return isNil(this.altered) ? false : this.altered.includes(findIndex(this.payload, item))
    }
  }
}
