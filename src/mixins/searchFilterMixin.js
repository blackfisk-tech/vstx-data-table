import md5 from 'md5'
import { debounce, remove, orderBy, filter, isNil, forEach, isObject } from 'lodash'

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
        searchColumn: 'all',
        filters: [],
        offset: 0
      }
    }
  },
  computed: {
    getSearchColumn () {
      return [this.state.searchColumn]
    },
    getFilters () {
      return this.state.filters
    },
    getPagedData () {
      return this.getData.slice(this.state.offset * this.options.pagination.rowsPerPage, this.options.pagination.rowsPerPage + this.state.offset * this.options.pagination.rowsPerPage)
    },
    getData () {
      // Use Worker to Compute Order and Slice to prevent UI Lag
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
      let data = ((this.state.search.length || this.getFilters.length) && this.state.data.length > 0 ? this.state.data : this.getPayload)
      let sortedData = orderBy(data, this.getOrderBy.columns, this.getOrderBy.directions)
      return sortedData
    }
  },
  methods: {
    setSearchColumn (e) {
      this.state.searchColumn = e[0]
    },
    search (event = {}) {
      if (this.state.searchColumn === 'all') {
        this.state.search = event
        this.addFilter()
      } else {
        this.addFilter({
          search: event,
          column: this.state.searchColumn
        })
      }
    },
    searchRemove () {
      this.state.search = ''
      this.filterAndSearch(this.getPayload)
    },
    filterAndSearch (oldData) {
      this.state.offset = 0
      if (this.getFilters.length > 0) {
        forEach(this.getFilters, (filter, i) => {
          oldData = this.filter(oldData, filter)
        })
      }
      if (this.state.search.length > 0) {
        console.log('Before Search', this.state.search, oldData.length)
        oldData = this.filter(oldData, {'value': this.state.search})
        console.log('After Search', this.state.search, oldData.length)
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
      this.filterAndSearch((this.getFilters.length && this.state.data.length > 0 ? this.state.data : this.getPayload))
    }, 275),
    find (o, criteria) {
      // Todo --- support deep column search
      let found = false
      forEach(o, (value, key) => {
        if (!isObject(value) && found === false) {
          let match = isNil(value) ? [] : isNil(criteria.column) || criteria.column === key ? value.toString().match(new RegExp(criteria.value, 'i')) : []
          let isMatch = !isNil(value) && !isNil(match) && match.length > 0
          if (isMatch) {
            found = true
          }
        } else if (found === false) {
          let isMatch = this.find(value, criteria)
          if (isMatch) {
            found = true
          }
        }
      })
      return found
    },
    filter (data, criteria) {
      if ('value' in criteria && !isNil(criteria.value)) {
        if (criteria.column === 'sellerName' && criteria.value === 'Amazon.com') {
          console.log('Finding Amazon.com Seller')
        }
        return filter(data, (o) => {
          return this.find(o, criteria)
        })
      } else {
        // Exception Criteria Structure
      }
    },
    filterRemove (filter) {
      remove(this.getFilters, filter)
      this.filterAndSearch(this.getPayload)
    },
    getFilterId (filter) {
      return md5(`${filter.value}${filter.column}`)
    }
  }
}
