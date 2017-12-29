import md5 from 'md5'
import { debounce, remove, orderBy, filter, isNil, forEach } from 'lodash'

export const searchFilterMixin = {
  created () {
    this.state.search = ''
    this.state.filters = isNil(this.filters) ? [] : this.filters
  },
  data () {
    return {
      state: {
        data: [],
        search: '',
        filters: [],
        offset: 0
      }
    }
  },
  computed: {
    getFilters () {
      return this.state.filters
    },
    getPagedData () {
      return this.getData.slice(this.state.offset * this.options.pagination.rowsPerPage, this.options.pagination.rowsPerPage + this.state.offset * this.options.pagination.rowsPerPage)
    },
    getData () {
      // Use Worker to Compute Order and Slice
      /*
        Workers are ASYNC. This cannot be in a computed property.
      */
      // let workerData = {
      //   payload: this.payload,
      //   columns: this.getOrderBy.columns,
      //   directions: this.getOrderBy.directions,
      //   offset: this.state.offset,
      //   rowsPerPage: this.options.pagination.rowsPerPage
      // }
      // const OrderByWorker = require('worker-loader!./workers/orderByAndPaginate.js')
      // let worker = new OrderByWorker()
      // worker.postMessage(workerData)
      // worker.onmessage = (event) => {
      //   console.log('onmessage', event.data)
      // }
      let data = ((this.state.search.length || this.state.filters.length) && this.state.data.length > 0 ? this.state.data : this.getPayload)
      let sortedData = orderBy(data, this.getOrderBy.columns, this.getOrderBy.directions)
      return sortedData
    }
  },
  methods: {
    search (event = {}) {
      this.state.search = event
      this.addFilter()
    },
    searchRemove () {
      this.state.search = ''
      this.filterAndSearch(this.getPayload)
    },
    filterAndSearch (oldData) {
      this.state.offset = 0
      if (this.state.filters.length > 0) {
        forEach(this.state.filters, (filter, i) => {
          oldData = (this.state.search.length > 0 && i === this.state.filters.length - 1 ? this.filter(oldData, {'value': this.state.search}) : this.filter(oldData, filter))
        })
      } else if (this.state.search.length > 0) {
        oldData = this.filter(oldData, {'value': this.state.search})
      }
      this.state.data = oldData
    },
    addFilter: debounce(function (event = {}) {
      if (event.hasOwnProperty('search') && !isNil(event.search) && event.search.length > 0) {
        this.state.filters.push({
          'value': event.search,
          ...(event.hasOwnProperty('column') && event.column.length > 0) && {'column': event.column}
        })
      }
      this.filterAndSearch((this.state.filters.length ? this.state.data : this.getPayload))
    }, 275),
    filter (data, criteria) {
      if (criteria.hasOwnProperty('value') && !isNil(criteria.value)) {
        return filter(data, (o) => {
          let found = false
          forEach(o, (key) => {
            let match = key.toString().match(new RegExp(criteria.value, 'i'))
            found = !isNil(key) && !isNil(match) && match.length > 0
            return !found
          })
          return found
        })
      } else {
        // Exception Criteria Structure
      }
    },
    filterRemove (filter) {
      remove(this.state.filters, filter)
      this.filterAndSearch(this.getPayload)
    },
    getFilterId (filter) {
      return md5(`${filter.value}${filter.column}`)
    }
  }
}
