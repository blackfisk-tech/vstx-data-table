import md5 from 'md5'
import { debounce, remove, find, isNil, cloneDeep, orderBy, filter } from 'lodash'

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
        searchColumnText: '',
        filters: [],
        offset: 0
      }
    }
  },
  computed: {
    getSearch () {
      return this.state.search
    },
    getSearchColumn () {
      return [this.state.searchColumn]
    },
    getFilters () {
      return this.state.filters
    },
    allowWorkers () {
      return window.Worker && '$worker' in this && this.options.allowWorkers
    }
  },
  asyncComputed: {
    getData: {
      async get () {
        const data = ((this.state.search.length || this.getFilters.length) && this.state.data.length > 0 ? this.state.data : this.getPayload)
        const result = await this.sortData(data)
        return result
      },
      default: []
    },
    getPagedData: {
      async get () {
        const result = await this.sliceData(this.getData)
        return result
      },
      default: []
    }
  },
  methods: {
    clearFilters () {
      this.state.filters = []
      this.state.offset = 0
    },
    clearSearch () {
      this.state.search = ''
      this.state.searchColumn = 'all'
      this.state.searchColumnText = ''
    },
    onFilterClick (e) {
      this.addFilter(e)
    },
    emitFilter (e) {
      this.$emit('onFilter', e)
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    async sliceData (data) {
      let result = []
      if (this.allowWorkers) {
        result = await this.$worker.run((data, offset, rowsPerPage) => {
          return !(data == null) ? data.slice(offset * rowsPerPage, rowsPerPage + offset * rowsPerPage) : []
        }, [cloneDeep(data), this.state.offset, this.options.pagination.rowsPerPage])
      } else {
        result = !(data == null) ? data.slice(this.state.offset * this.options.pagination.rowsPerPage, this.options.pagination.rowsPerPage + this.state.offset * this.options.pagination.rowsPerPage) : []
      }
      return result
    },
    async sortData (data) {
      let result = []
      if (this.allowWorkers) {
        result = await this.$worker.run((data, sortedColumns) => {
          importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js')
          const getOrderBy = (sortedColumns) => {
            let topColumns = []
            let columns = []
            let directions = []
            _.forEach(sortedColumns, (value) => {
              if (value.sort.direction !== '') {
                topColumns.push((!_.isNil(value.sort.sortByColumn) ? value.sort.sortByColumn : value.field))
                let column = (!_.isNil(value.sort.sortByField) ? value.sort.sortByField : value.field)
                let sortByColumn = ''
                if (value.format === 'formatString') {
                  sortByColumn = (item) => {
                    if (_.isNil(item[column])) {
                      let value = _.get(item, column)
                      return _.isString(value) ? value.toLowerCase() : value
                    } else if (item[column].hasOwnProperty('toLowerCase')) {
                      return item[column].toLowerCase()
                    } else {
                      return item[column]
                    }
                  }
                } else {
                  sortByColumn = (item) => {
                    if (_.isNil(item[column])) {
                      return _.get(item, column)
                    } else {
                      return item[column]
                    }
                  }
                }
                columns.push(sortByColumn)
                directions.push(value.sort.direction)
              }
            })
            let data = {
              topColumns,
              columns,
              directions
            }
            return data
          }
          const orderBy = getOrderBy(sortedColumns)
          /* eslint no-undef: 'off' */
          const sorted = _.orderBy(data, orderBy.columns, orderBy.directions)
          return sorted
        }, [cloneDeep(data), cloneDeep(this.getSortedColumns)])
      } else {
        const orderByColumns = this.getOrderBy
        /* eslint no-undef: 'off' */
        const sorted = orderBy(data, orderByColumns.columns, orderByColumns.directions)
        result = sorted
      }
      return result
    },
    setSearchColumn (e) {
      this.state.searchColumn = e[0]
      let column = find(this.getColumns, (column) => {
        return column.field === e[0]
      })
      this.state.searchColumnText = column.name
    },
    search (event = {}) {
      if (this.state.searchColumn === 'all') {
        this.state.search = event
        this.addFilter()
      } else {
        this.addFilter({
          search: event,
          column: this.state.searchColumn,
          text: this.state.searchColumnText
        })
        this.state.search = ''
        this.state.searchColumn = 'all'
      }
    },
    async searchRemove () {
      this.state.search = ''
      await this.filterAndSearch(this.getPayload)
    },
    async filterAndSearch (oldData) {
      this.state.offset = 0
      if (this.getFilters.length > 0) {
        for (let i = 0; i < this.getFilters.length; i++) {
          const filter = this.getFilters[i]
          oldData = await this.filter(oldData, filter)
        }
      }
      oldData = await this.filter(oldData, {'value': this.state.search})
      this.state.data = oldData
    },
    addFilter: debounce(async function (event = {}) {
      if ('search' in event && !isNil(event.search)) {
        this.state.filters.push({
          'value': event.search,
          ...(event.hasOwnProperty('column') && event.column.length > 0) ? {'column': event.column} : null,
          ...(event.hasOwnProperty('text') && event.text.length > 0) ? {'text': event.text} : null
        })
        this.$nextTick(() => {
          this.emitFilter(event)
        })
      }
      await this.filterAndSearch((this.getFilters.length && this.state.data.length > 0 ? this.state.data : this.getPayload))
    }, 275),
    async filter (data, criteria) {
      if ('value' in criteria && !isNil(criteria.value)) {
        if (this.allowWorkers) {
          const result = await this.$worker.run((data, criteria) => {
            importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js')
            const deepFind = (o, criteria, level = 0, topLevel = '') => {
              let found = false
              /* eslint no-undef: 'off' */
              if (level === 0 && !_.isNil(criteria.column) && criteria.column.includes('.')) {
                let match = _.get(o, criteria.column).toString().match(new RegExp(criteria.value, 'i'))
                let isMatch = !_.isNil(_.get(o, criteria.column)) && !_.isNil(match) && match.length > 0
                if (isMatch) {
                  found = true
                }
              } else {
                _.forEach(o, (value, key) => {
                  if (level === 0) {
                    topLevel = key
                  }
                  if (!_.isObject(value) && found === false) {
                    let match = _.isNil(value) ? [] : _.isNil(criteria.column) || criteria.column === key || criteria.column === topLevel ? value.toString().match(new RegExp(criteria.value, 'i')) : []
                    let isMatch = !_.isNil(value) && !_.isNil(match) && match.length > 0
                    if (isMatch) {
                      found = true
                    }
                  } else if (found === false) {
                    let oldLevel = level
                    if (!Array.isArray(value)) {
                      level++
                    }
                    let isMatch = deepFind(value, criteria, level, topLevel)
                    level = oldLevel
                    if (isMatch) {
                      found = true
                    }
                  }
                })
              }
              return found
            }
            return _.filter(data, (o) => {
              return deepFind(o, criteria)
            })
          }, [cloneDeep(data), cloneDeep(criteria)])
          return result
        } else {
          const deepFind = (o, criteria, level = 0, topLevel = '') => {
            let found = false
            /* eslint no-undef: 'off' */
            if (level === 0 && !_.isNil(criteria.column) && criteria.column.includes('.')) {
              let match = _.get(o, criteria.column).toString().match(new RegExp(criteria.value, 'i'))
              let isMatch = !_.isNil(_.get(o, criteria.column)) && !_.isNil(match) && match.length > 0
              if (isMatch) {
                found = true
              }
            } else {
              _.forEach(o, (value, key) => {
                if (level === 0) {
                  topLevel = key
                }
                if (!_.isObject(value) && found === false) {
                  let match = _.isNil(value) ? [] : _.isNil(criteria.column) || criteria.column === key || criteria.column === topLevel ? value.toString().match(new RegExp(criteria.value, 'i')) : []
                  let isMatch = !_.isNil(value) && !_.isNil(match) && match.length > 0
                  if (isMatch) {
                    found = true
                  }
                } else if (found === false) {
                  let oldLevel = level
                  if (!Array.isArray(value)) {
                    level++
                  }
                  let isMatch = deepFind(value, criteria, level, topLevel)
                  level = oldLevel
                  if (isMatch) {
                    found = true
                  }
                }
              })
            }
            return found
          }
          let result = filter(data, (o) => {
            return deepFind(o, criteria)
          })
          return result
        }
      } else {
        return []
      }
    },
    async filterRemove (filter) {
      remove(this.getFilters, filter)
      await this.filterAndSearch(this.getPayload)
    },
    getFilterId (filter) {
      return md5(`${filter.value}${filter.column}`)
    }
  }
}
