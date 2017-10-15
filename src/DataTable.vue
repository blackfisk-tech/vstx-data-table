<template lang="pug">
  .data-table
    .data-table__filters__active(v-if="state.search.length",style="padding-bottom:10px;") 
      nav.breadcrumb(aria-label="filters")
        ul
          li Filtering by:&nbsp;&nbsp;
            span.tag.is-primary {{ state.search }}
              button(class="delete is-small", @click="filterClear")
    .level.data-table__head
      .level-left
        //- Table Title
        slot(name="slot-title")
      .level-right
        //- Filter Slot
        slot(name="filter", v-if="options.filter.isAllowed && options.filter.isVisible")
          vstx-search-bar.data-table__search(v-if="options.filter.isEvent", :value="state.search", :search="state.search", @onSearch="$emit('onSearch', $event)")
          vstx-search-bar.data-table__search(v-else="", :value="state.search", :search="state.search", @onSearch="filter($event)")
        span.label.is-small(v-if="options.totals.isAllowed && options.totals.isVisible.count") {{ getRowCount }} Rows
        a.is-small.data-table__settings(@click.passive="toggleOptions", v-if="options.settings.isAllowed && options.settings.isVisible")
          span.icon
            i.fa.fa-table
        a.is-small.data-table__settings(@click.passive="toggleColumnOptions", v-if="options.settings.isAllowed && options.settings.isVisible && options.columns.isAllowed")
          span.icon
            i.fa.fa-columns
    //- Controls
    table.table.is-narrow.is-relative-position(v-bind:class="{'is-overflow-hidden': options.settings.overflow, 'is-bordered': options.table.bordered, 'is-striped': options.table.striped}")
      //- Settings
      transition(name="slideUp", @after-leave.passive="setOverflow(false)")
        caption.is-overlay(v-if="options.orderBy.isAllowed && options.orderBy.isVisible")
          //- Settings
          div(slot="settings")
            nav.panel
              div.panel-heading
                span Table Settings&nbsp;
                span.is-pulled-right
                  //- Edit
                  a.button.is-small.options__edit(@click.passive="state.editMode = !state.editMode")
                    i.fa.fa-edit
                  //- Save
                  a.button.is-small.options__save(@click.passive="saveEdits", v-if="state.editMode")
                    span.icon
                      i.fa.fa-download
                    | &nbsp;&nbsp;Save Changes
                  //- Clear Saved State
                  a.is-warning.button.is-small.options__clearState(@click.passive="clearLocalSettings")
                    span.icon.is-small
                      i.fa.fa-remove
                  //- Add Columns
                  a.is-success.button.is-small.options__addColumn(@click.passive="toggleOptions")
                    span.icon.is-small
                      i.fa.fa-columns
              //- Totals
              div.panel-block
                .columns.is-multiline
                  //- Rows Per Page
                  div.column.is-narrow
                    .field.is-grouped.data-table__rowsPerPage
                      p.control.has-icons-left
                        span.select.is-small
                          select(id="data-table__rows-per-page", v-model.number="options.pagination.rowsPerPage")
                            option(value="10") 10 Rows Per Page
                            option(value="25") 25 Rows Per Page
                            option(value="50") 50 Rows Per Page
                            option(value="100") 100 Rows Per Page
                        span.icon.is-small.is-left
                          i.fa.fa-list
                  //- All
                  div.column.is-narrow
                    p.control(v-if="options.totals.isAllowed")
                      label.checkbox
                        input(type="checkbox", v-model="options.totals.isVisible.all")
                        | Show Data Totals
                  //- Page
                  div.column.is-narrow
                    p.control(v-if="options.totals.isAllowed")
                      label.checkbox
                        input(type="checkbox", v-model="options.totals.isVisible.page")
                        | Show Page Totals
                  //- Rank
                  div.column.is-narrow
                    p.control
                      label.checkbox
                        input(type="checkbox", v-model="options.isRanked")
                        | Show Rank
                  //- Filter
                  div.column.is-narrow
                    p.control(v-if="options.filter.isAllowed")
                      label.checkbox
                        input(type="checkbox", v-model="options.filter.isVisible")
                        | Show Filter
                  //- All
                  div.column.is-narrow
                    p.control(v-if="options.sortIndicator.isAllowed")
                      label.checkbox
                        input(type="checkbox", v-model="options.sortIndicator.isVisible")
                        | Show Sort Order Numbering
                  //- Page
                  div.column.is-narrow
                    p.control(v-if="options.totals.isAllowed")
                      label.checkbox
                        input(type="checkbox", v-model="options.totals.isVisible.count")
                        | Show Row Count
              //- Sorting
              div.panel-block
                //- Order By
                draggable-list(:list="getSortedColumns", @changed.passive="updateOrderBy")
                  span(slot="slot-title") Order By:&nbsp;&nbsp;
                  template(slot="slot-item", slot-scope="props")
                    div.draggable__level
                      span.label.is-small.orderByItem {{ props.item.name }} {{ props.item.sort.direction }}
                //- Column Order
                draggable-list(:list="getDisplayColumns", @changed.passive="updateColumnOrder")
                  span(slot="slot-title") Column Order:&nbsp;&nbsp;
                  template(slot="slot-item", slot-scope="props")
                    div.draggable__level
                      span.label.is-small.orderByItem {{ props.item.name }}

      thead
        //- Header
        tr.column__headers
          th(v-if="options.isRanked") #
          th.column__header(v-for="(column, idx) in getDisplayColumns", :class="getColumnAlignment(column)", style="position:relative;")
            div
              span(v-if="column['sort']['isSortable']")
                a(@click.passive="toggleSortDirection(column['field'])") {{ column['name'] }}&nbsp;
                  span.icon.is-small(:class="getColumnState(column['field'])")
                a.tag(v-if="options.sortIndicator.isVisible && getSortPosition(column['field']) !== -1", @click.passive="toggleSortDirection(column['field'])") {{ getSortPosition(column['field']) + 1 }}
              span(v-else="") {{ column['name'] }}&nbsp;
            //- Column Settings
            .column__settings(v-if="options.columns.isAllowed && options.columns.isVisible")
              label.subtitle.is-6 Format:
              .field.is-grouped.data-table__field.data-table__rowsPerPage
                p.control.has-icons-left
                  span.select.is-small
                    select(id="column__format", v-model="column.format")
                      option(value="formatNumber")  Number
                      option(value="formatMoney")  Money
                      option(value="formatPercent")  Percent
                      option(value="formatString")  String
                      option(value="seller") Seller
                      option(value="brand") Brand
                      option(value="asin") ASIN
                  span.icon.is-small.is-left
                    i.fa.fa-wrench
              .field.data-table__field
                div.control
                  label.subtitle.is-6(class="checkbox")
                    input(type="checkbox", v-model="column['sort']['isSortable']")
                    | &nbsp;Sortable

        //- Top Totals
        tr.data-table__total-row(v-if="options.totals.isVisible.all && getData.length > 0")
          td.data-table__row(v-if="options.isRanked"): strong Totals
          td.data-table__row(v-for="(column, idx) in getDisplayColumns", :class="column['align'] === 'Left' ? 'has-text-left' : 'has-text-right'")
            data-table-cell(v-if="column['format'] !== 'seller' && column['format'] !== 'brand' && column['format'] !== 'product'", :column="column", :item="state.totals[column['field']]", :edit="false", :editable="false")
            div(v-else="")
      tfoot
        //- Bottom Totals
        tr.data-table__total-row(v-if="options.totals.isVisible.page && getData.length > 0")
          td.data-table__row(v-if="options.isRanked"): strong Page Totals
          td.data-table__row(v-for="(column, idx) in getDisplayColumns", :class="column['align'] === 'Left' ? 'has-text-left' : 'has-text-right'")
            data-table-cell(v-if="column['format'] !== 'seller' && column['format'] !== 'brand' && column['format'] !== 'product'", :column="column", :item="getColumnTotal(column, 'page')", :edit="false", :editable="false")
            div(v-else="")
        //- Pagination
        tr(v-if="options.pagination.isAllowed && options.pagination.isVisible")
          td.pagination__controls(:colspan="getColspan")
            nav.pagination.is-left.is-small
              a.pagination-previous(@click.passive="pageBack",:disabled="state.offset - 1 >= 0 ? false : true"): i.fa.fa-angle-left
              a.pagination-next(@click.passive="pageForward",:disabled="state.offset + 1 < getPagination[getPagination.length - 1] ? false : true"): i.fa.fa-angle-right
              ul.pagination-list.data-table__pagination-list
                li(class="data-table__pagination-list-item",v-for="i in getPagination"): a(v-bind:class="{'pagination-ellipsis':isNaN(i),'pagination-link':!isNaN(i),'is-current': i - 1 === state.offset ? true : false}" @click.passive="state.offset = i - 1") {{ i }}
      tbody
        tr(v-if="getData.length === 0 || isLoading")
          td(:colspan="getColspan")
            section.hero.is-medium.is-light
              .hero-body.has-text-centered
                slot(name="error")
                  p.subtitle &nbsp;Loading...&nbsp;
                    loader(:barCount="parseInt(5)", size="small")
        tr(v-if="!isLoading", v-for="(item, i) in getData")
          td.data-table__row(:class="{'borderless': !options.table.cellbordered}", v-if="options.isRanked") {{ (i + 1) + (state.offset * options.pagination.rowsPerPage) }}
          td.data-table__row(v-for="(column, idx) in getDisplayColumns", :class="getColumnAlignment(column)")
            slot(:name="column.field")&attributes({':item': 'item', ':column': 'column', ':edit': 'state.editMode', ':editable': 'state.editMode'})
              data-table-cell()&attributes({'@onFilter': 'filter($event)', ':item': 'item', ':column': 'column', ':edit': 'state.editMode', ':editable': 'state.editMode'})
</template>

<script>
import DataTableCell from './DataTableCell.vue'
import { orderBy, sortBy, filter, forEach, throttle, indexOf, differenceWith, isEqual, merge, cloneDeep, debounce } from 'lodash'
import SearchBar from 'vstx-search-bar'
import Loader from 'vstx-loader'
import DraggableList from 'vstx-draggable-list'
import joi from 'joi'
import localStore from 'store'
import md5 from 'md5'

// The defaults should be set here so they can used for the merge function and the prop defaults.
const defaults = {
  configuration: {
    collapsePages: false,
    isRanked: false,
    table: {
      bordered: false,
      striped: false,
      cellbordered: false
    },
    settings: {
      overflow: false,
      isVisible: true,
      isAllowed: true,
      offset: 0
    },
    sortIndicator: {
      isVisible: true,
      isAllowed: true
    },
    filter: {
      isVisible: false,
      isAllowed: true,
      isEvent: false
    },
    columns: {
      isVisible: false,
      isAllowed: true
    },
    pagination: {
      rowsPerPage: 10,
      isAllowed: true,
      isVisible: true
    },
    orderBy: {
      isVisible: false,
      isAllowed: true
    },
    totals: {
      isVisible: {
        all: false,
        page: false,
        count: false
      },
      isAllowed: true
    }
  }
}
// Joi Validation Schemas
const schemas = {
  configuration: {
    schema: joi.object().keys({
      collapsePages: joi.boolean(),
      isRanked: joi.boolean(),
      columns: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      settings: joi.object().keys({
        overflow: joi.boolean(),
        isVisible: joi.boolean(),
        isAllowed: joi.boolean(),
        offset: joi.number().integer().min(0)
      }),
      sortIndicator: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      filter: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      pagination: joi.object().keys({
        rowsPerPage: joi.number().integer().min(10).max(100),
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      orderBy: joi.object().keys({
        isVisible: joi.boolean(),
        isAllowed: joi.boolean()
      }),
      totals: joi.object().keys({
        isVisible: joi.object().keys({
          all: joi.boolean(),
          page: joi.boolean(),
          count: joi.boolean()
        }),
        isAllowed: joi.boolean()
      })
    }),
    options: {}
  },
  payload: {
    schema: joi.array().items(joi.object().min(1)),
    options: {}
  },
  columns: {
    schema: joi.array().items(
      joi.object().keys({
        name: joi.string().min(1).required(),
        editing: joi.object().keys({
          edit: joi.boolean(),
          isAllowed: joi.boolean()
        }),
        align: joi.string().lowercase().valid(['left', 'right', 'centered']),
        field: joi.string(),
        format: joi.string(),
        hasLink: joi.boolean(),
        showLogo: joi.boolean(),
        position: joi.number().required(),
        isVisible: joi.boolean(),
        link: joi.string(),
        linkReplaceText: joi.string(),
        linkReplaceField: joi.string(),
        eventName: joi.string(),
        eventData: joi.any(),
        sort: joi.object().keys({
          isSortable: joi.boolean(),
          direction: joi.string().lowercase().allow('').valid(['asc', 'desc', '']),
          order: joi.number().min(0)
        }).and('order', 'isSortable', 'direction')
      }).and('linkReplaceText', 'linkReplaceField')
    ),
    options: {
      allowUnknown: true,
      convert: false
    }
  }
}
export default {
  name: 'data-table',
  introduction: 'A data table component for the Vue Stacks Template',
  description: '',
  token: `data-table-cell()&attributes({:payload: 'payload', :options: 'options'})`,
  created () {
    // Configure
    if (this.payload.length > 0) {
      this.configure()
    }
    // Create Unique ID
    this.assignUniqueID()
    // Load Saved State from LocalStorage
    let storedSettings = localStore.get(this.uniqueID)
    if (typeof storedSettings === 'undefined') {
      localStore.set(this.uniqueID, {
        state: this.state,
        options: this.options
      })
    } else {
      this.state = storedSettings.state
      this.options = storedSettings.options
    }
  },
  destroyed () {
    // Persist State to LocalStorage
    localStore.set(this.uniqueID, {
      state: this.state,
      options: this.options
    })
  },
  components: {
    'data-table-cell': DataTableCell,
    'draggable-list': DraggableList,
    'loader': Loader,
    'vstx-search-bar': SearchBar
  },
  props: {
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    payload: {
      note: 'An Array of Objects of the DATA__ROW class.',
      type: Array,
      required: false,
      default: () => { return [] },
      validator: value => {
        return joi.validate(value, schemas.payload.schema, (err, value) => {
          return err ? () => { throw err } : true
        })
      }
    },
    configuration: {
      note: 'Data table options include showing/hiding, allowing, paging, rowsPerPage, and more.',
      type: Object,
      required: false,
      default: () => {
        return defaults.configuration
      },
      validator: value => {
        return joi.validate(value, schemas.configuration.schema, (err, value) => {
          return err ? () => { throw err } : true
        })
      }
    },
    columns: {
      note: '[OPTIONAL] Pass in explicit Columns with custom Options',
      type: Array,
      required: false,
      default: () => { return [] },
      validator: value => {
        return joi.validate(value, schemas.columns.schema, schemas.columns.options, (err, value) => {
          return err ? () => { throw err } : true
        })
      }
    },
    id: {
      note: '',
      type: String,
      default: () => { return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) }
    }
  },
  watch: {
    'options.totals.isVisible.all' () {
      // Calculate Totals Only when Necessary
      if (!this.state.hasCalculatedTotals) {
        this.computeTotals()
      }
    },
    'isLoading' () {
      if (this.isLoading) {
        // Altering Prop, but it's fine.
        this.payload = []
        this.state.columns = []
        this.hasCalculatedTotals = false
        this.totals = {}
        this.computeTotals()
      }
    }
  },
  data () {
    return {
      uniqueID: '',
      state: {
        data: [],
        search: '',
        hasCalculatedTotals: false,
        totals: {},
        offset: this.getConfiguration().settings.offset,
        columns: [],
        editMode: false
      },
      options: this.getConfiguration()
    }
  },
  computed: {
    getRowCount () {
      if (this.state.search.length) {
        return this.state.data.length
      } else {
        return this.payload.length
      }
    },
    getPayload () {
      if (this.payload.length > 0) {
        this.configure()
      }
      return this.payload
    },
    getColspan () {
      return this.options.isRanked ? this.state.columns.length + 1 : this.state.columns.length
    },
    getDisplayColumns () {
      let columns = sortBy(filter(this.state.columns, 'isVisible'), [ (c) => { return c.position } ])
      return columns
    },
    getSortedColumns () {
      let sortedCols = sortBy(filter(this.state.columns, column => {
        return column.sort.isSortable && column.sort.direction !== ''
      }), [ (c) => {
        return c.sort.order
      } ])
      return sortedCols
    },
    getPagination () {
      let data = []
      if (this.state.search.length) {
        data = this.state.data
      } else {
        data = this.getPayload
      }
      let totalPages = Math.round(data.length / this.options.pagination.rowsPerPage)
      let returnData = []
      let min = (this.state.offset - 4 < 0 ? 0 : this.state.offset - 4)
      let max = min + 10
      for (let i = 0; i < totalPages; i++) {
        if ((returnData.length < this.listPages && this.state.offset === 0) || (i >= min && i < max)) {
          returnData.push(i + 1)
        }
      }
      if (min >= 1) {
        returnData[0] = 1
        returnData.splice(1, 1, '...')
      }
      if (max < totalPages) {
        returnData[returnData.length - 1] = totalPages - 1
        returnData[returnData.length] = totalPages
        returnData.splice(returnData.length - 3, 1, '...')
      }
      return returnData
    },
    getOrderBy () {
      let columns = []
      let directions = []
      forEach(this.getSortedColumns, (value) => {
        if (value.sort.direction !== '') {
          columns.push(value.field)
          directions.push(value.sort.direction)
        }
      })
      let data = {
        columns,
        directions
      }
      return data
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
      let data = []
      if (this.state.search.length) {
        data = this.state.data
      } else {
        data = this.getPayload
      }
      let sortedData = orderBy(data, this.getOrderBy.columns, this.getOrderBy.directions)
      sortedData = sortedData.slice(this.state.offset * this.options.pagination.rowsPerPage, this.options.pagination.rowsPerPage + this.state.offset * this.options.pagination.rowsPerPage)
      return sortedData
    }
  },
  methods: {
    filter: debounce(function(event = {}) {
      if (event.hasOwnProperty('search') && typeof event.search !== 'undefined' ) {
        this.state.offset = 0
        this.state.search = event.search
        let newData = filter(this.getPayload, (o) => {
          let found = false
          for (let key in o) {
            if (event.hasOwnProperty('column') && event.column.length) {
              if (key === event.column) {
                if (o[key] !== 'null' && o[key] !== null) {
                  let match = o[key].toString().match(new RegExp(event.search, 'i'))
                  if( match !== 'null' && match !== null && match.length > 0) {
                    found = true
                  }
                }
              }
            } else {
              if (o[key] !== 'null' && o[key] !== null) {
                let match = o[key].toString().match(new RegExp(event.search, 'i'))
                if( match !== 'null' && match !== null && match.length > 0) {
                  found = true
                }
              }
            }
          }
          return found
        })
        this.state.data = newData
      }
    }, 275),
    filterClear () {
      this.state.search = ""
    },
    assignUniqueID () {
      // let thisHash = md5(this.$parent.$options.name + JSON.stringify(this.state) + JSON.stringify(this.options))
      let thisHash = md5(`${this.id}`)
      this.uniqueID = thisHash
    },
    clearLocalSettings () {
      localStore.remove(this.uniqueID)
    },
    onTableClick (event) {
      let headerRows = document.getElementsByClassName('column__headers')
      let target = event.target
      for (let i = 0; i < headerRows.length; i++) {
        let headerRow = headerRows[i]
      }
    },
    getDecimalPlaces (num) {
      var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
      if (!match) {
        return 0
      }
      return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
      )
    },
    configure () {
      this.populateColumnsFromPayload()
      this.collapsePages()
      this.checkRequiresPagination()
      // Calculate Data Totals if Necessary
      if (this.options.totals.isVisible.all) {
        this.computeTotals()
      }
    },
    collapsePages () {
      // Default RowsPerPage to 25 when Necessary
      if (this.options.collapsePages && this.options.pagination.rowsPerPage < 25 && ((this.payload.length > 10 && this.payload.length <= 25) || (this.columns.length > 6))) {
        this.options.pagination.rowsPerPage = 25
      } else {
        this.options.pagination.rowsPerPage = this.options.pagination.rowsPerPage
      }
    },
    checkRequiresPagination () {
      // Hide Pagination if Content is One Page Only
      if (this.options.pagination.rowsPerPage >= this.payload.length) {
        this.options.pagination.isAllowed = false
      } else {
        this.options.pagination.isAllowed = true
      }
    },
    populateColumnsFromPayload () {
      if (this.state.columns.length === 0) {
        if (this.columns.length === 0) {
          let firstRow = this.payload[0]
          let rowKeys = Object.keys(firstRow)
          let columns = []
          for (let i = 0; i < rowKeys.length; i++) {
            let columnName = rowKeys[i]
            let firstValue = firstRow[columnName]
            let columnFormat = 'formatString'
            let alignment = 'left'
            if (typeof firstValue === 'number') {
              alignment = 'right'
              if (columnName.toLowerCase().includes('percent') || columnName.includes('%')) {
                columnFormat = 'formatPercent'
              } else if (this.getDecimalPlaces(firstValue) === 2) {
                columnFormat = 'formatMoney'
              } else {
                columnFormat = 'formatNumber'
              }
            }
            let column = {
              name: rowKeys[i],
              format: columnFormat,
              field: rowKeys[i],
              align: alignment,
              position: i,
              isVisible: true,
              editing: {
                edit: false,
                isAllowed: false
              },
              sort: {
                isSortable: true,
                direction: '',
                order: i
              }
            }
            columns.push(column)
          }
          this.state.columns = columns
        } else {
          this.state.columns = this.columns
        }
      }
    },
    getConfiguration () {
      let defaultsCopy = cloneDeep(defaults)
      let configuration = merge(defaultsCopy.configuration, this.configuration)
      return configuration
    },
    updateOrderBy (columns) {
      let lastIndex = 0
      for (let i = 0; i < columns.length; i++) {
        columns[i].sort.order = i
        lastIndex = i
      }
      let diff = differenceWith(this.state.columns, columns, isEqual)
      for (let i = 0; i < diff.length; i++) {
        diff[i].sort.order = lastIndex + i + 1
        columns.push(diff[i])
      }
      this.state.columns = columns
    },
    updateColumnOrder (columns) {
      for (let i = 0; i < columns.length; i++) {
        columns[i].position = i
      }
      this.state.columns = columns
    },
    setOverflow (boolean) {
      this.options.settings.overflow = boolean
    },
    toggleColumnOptions () {
      if (this.options.columns.isVisible === true) {
        this.options.columns.isVisible = false
      } else {
        this.options.settings.overflow = true
        this.options.columns.isVisible = true
      }
    },
    toggleOptions () {
      if (this.options.orderBy.isVisible === true) {
        this.options.orderBy.isVisible = false
      } else {
        this.options.settings.overflow = true
        this.options.orderBy.isVisible = true
      }
    },
    openColumnOptions: throttle((e) => {
      this.options.settings.overflow = true
      this.options.columns.isVisible = true
    }, 500),
    closeColumnOptions: throttle((e) => {
      this.options.columns.isVisible = false
    }, 500),
    openOptions: throttle((e) => {
      this.options.settings.overflow = true
      this.options.orderBy.isVisible = true
    }, 500),
    closeOptions: throttle((e) => {
      this.options.orderBy.isVisible = false
    }, 500),
    getColumnTotal (column, scope) {
      let total = 0
      let isTotalable = true
      if (column['format'] === 'formatString' || column['format'] === '') {
        isTotalable = false
      } else {
        isTotalable = true
      }
      if (scope === 'page') {
        for (let i = 0; i < this.getData.length; i++) {
          total = total + this.getData[i][column['field']]
        }
      } else if (scope === 'all') {
        for (let i = 0; i < this.getPayload.length; i++) {
          total = total + this.getPayload[i][column['field']]
        }
      }
      let value = total
      if (column['format'] === 'formatPercent') {
        value = value / this.getData.length
      }
      if (!isTotalable) {
        value = ''
      }
      let item = {
        'id': 1,
        'value': value,
        'type': 'total'
      }
      switch (column['format']) {
        case 'seller':
          return {}
        case 'brand':
          return {}
        case 'product':
          return {}
        default:
          return item
      }
    },
    computeTotals () {
      let isTotalable = true
      for (let c = 0; c < this.state.columns.length; c++) {
        let total = 0
        if (this.state.columns[c]['format'] === 'formatString' || this.state.columns[c]['format'] === '') {
          isTotalable = false
        } else {
          isTotalable = true
        }
        for (let i = 0; i < this.payload.length; i++) {
          let value = this.payload[i][this.state.columns[c]['field']]
          total = total + value
        }
        let value = total
        if (this.state.columns[c]['format'] === 'formatPercent') {
          value = value / this.payload.length
        }
        if (!isTotalable) {
          value = ''
        }
        let item = {
          'id': 1,
          'value': value,
          'type': 'total'
        }
        this.state.totals[this.state.columns[c]['field']] = item
      }
    },
    getColumnAlignment (column) {
      let alignment = `has-text-${column['align']}`
      let classes = {}
      classes[alignment] = true
      classes.borderless = !this.options.table.cellbordered
      return classes
    },
    getSortDirection (field) {
      let direction = this.getOrderBy.directions[this.getSortPosition(field)]
      return direction
    },
    getSortPosition (field) {
      let position = indexOf(this.getOrderBy.columns, field)
      return position
    },
    saveEdits () {
    },
    getColumnState (field) {
      let state = {
        'fa': true,
        'column__sort-indicator-asc': this.getSortDirection(field) === 'asc',
        'column__sort-indicator-desc': this.getSortDirection(field) === 'desc'
      }
      return state
    },
    toggleSortDirection (field) {
      let sortedColumns = 0
      let wasUnsorted = false
      let thisCol = {}
      for (let i = 0; i < this.getDisplayColumns.length; i++) {
        let col = this.getDisplayColumns[i]
        if (col.field === field) {
          thisCol = col
          if (col.sort.direction === 'asc') {
            col.sort.direction = 'desc'
          } else if (col.sort.direction === 'desc') {
            col.sort.direction = ''
          } else if (col.sort.direction === '') {
            wasUnsorted = true
            col.sort.direction = 'asc'
          }
        }
        if (col.sort.direction !== '' && col.sort.isSortable) {
          sortedColumns++
        }
      }
      if (sortedColumns === 1 && wasUnsorted) {
        this.updateOrderBy([thisCol])
      }
    },
    pageBack () {
      this.state.offset = this.state.offset - 1 >= 0 ? this.state.offset - 1 : 0
    },
    pageForward () {
      this.state.offset = this.state.offset + 1 < this.getPagination[this.getPagination.length - 1] ? this.state.offset + 1 : this.getPagination[this.getPagination.length - 1] - 1
    }
  }
}
</script>

<style lang="stylus">
  .data-table
    overflow-x: auto
  .data-table__field
    padding-bottom 5px
  .column__settings
    position absolute
    top 32px
    left 0px
    width 100%
    background white
    padding 5px
    border-bottom: 1px solid #eeeeee
    box-shadow: 3px 3px 2px 0px rgba(0,0,0,0.15)
  .column__headers
    white-space: nowrap
  .inline-block
    display: inline-block
  .level.data-table__head
    margin-bottom 10px
  caption
    background-color white
    z-index 99999999
    border grey
  caption.is-overlay
    margin-top 34px
  .is-relative-position
    position relative
    border 0
    padding 0
  .is-overflow-hidden
    overflow hidden
  .is-min-height-100
    min-height 100px
  .column--state-active
    @extend .is-active !optional

  .column__sort-indicator
    font-size .75em
    position relative
    top 4px
    if $orange is defined
      color $orange
    else
      color #FF6700
  .column__sort-indicator-asc:after
    @extend .column__sort-indicator
    content " \25B2"
  .column__sort-indicator-desc:after
    @extend .column__sort-indicator
    content " \25BC"
  .data-table__pagination-list
    list-style none
    margin-left 0
    margin-right 0
    margin-top 0
    margin-bottom 0
  .data-table__pagination-list-item
    margin-top 0em
    font-size font-size
  .pagination, .pagination-list
    justify-content left
  .pagination-link
    margin 3px
  .pagination-link:first-of-type
    margin-left 0
  .data-table__pagination-list-item a.pagination-link:not(.is-current)
    background: white
  .data-table__search
    margin-right 5px
  .pagination-next
    background white
  .pagination-previous
    background white
  .pagination__controls .columns .column
    background-color: $light-grey
    margin-right 8px
  .data-table__search.field
    margin-bottom 0
  .data-table__settings
    margin-left 0px
  .data-table__row
    font-size .85rem
  .data-table__rowsPerPage.field
    margin-bottom 0
  .control.has-icons-left .icon.is-small, .control.has-icons-right .icon.is-small
    width 1rem
    height 1rem
    top 6px
    left 6px
  .table.is-striped tbody tr:not(.is-selected):nth-child(even):hover
    background-color: hsla(0,0,0,.10)
  .table.is-striped tbody tr:not(.is-selected):nth-child(odd):hover
    background-color: hsla(0,0,0,.10)
  // Animation CSS
  .slideUp-enter-active
    animation fadeInUp .125s
  .slideUp-leave-active
    animation fadeInUp .25s reverse
  @keyframes fadeInUp {
    from {
      opacity 0;
      transform translate3d(0, 100%, 0);
    }

    to {
      opacity 1;
      transform none;
    }
  }
  //

  // Example of Fallback When Variable is not Defined
  /*
  body
    if $light-purple is defined
      background-color $light-purple
    else
      background-color white
  */
  //


  // Custom Label CSS
  // Example:
  /*
    span.label.is-small Hello Label
      a.delete.is-small
  */
  span.label
    font-size 1rem
    font-weight: normal
    margin 2px 5px
    padding 1px 3px
    background #fafafa
    border 1px solid #cccccc
  span.label.is-small
    font-size .75rem
    padding 3px 6px
    margin 0 2px;
  span.label button.delete
    margin-left 6px
    top 1px
  .table td.borderless, .table th
    border 0px
</style>
