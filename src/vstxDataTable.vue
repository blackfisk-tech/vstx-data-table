<template lang="pug">
  .data-table(
    :id="'data-table-' + this._uid"
    :class="{'is-scrolled': this.state.isScrolled}"
    @scroll="handleScroll"
  )
    .columns.is-multiline.is-marginless.data-table__head
      .column.is-narrow.is-paddingless.title-column(v-if="$slots['slot-title'] && $slots['slot-title'].length > 0")
        //- Table Title
        slot(name="slot-title")
      .column.is-narrow.is-paddingless
        .buttons.has-addons
          slot(name="slot-pre-controls")
          //- Filter Slot
          slot(
            name="filter"
            v-if="options.filter.isAllowed && options.filter.isVisible"
          )
            .field.has-addons.is-marginless(
              v-if="options.filter.isEvent"
            )
              .control
                vstx-search-bar.data-table__search(
                  :value="getSearch"
                  @input="$emit('onSearch', $event)"
                  :size="options.size"
                )
            .field.has-addons.is-marginless(
              v-else=""
            )
              .control
                vstx-select.data-table__select(
                  :size="options.size"
                  :options="getColumnOptions"
                  :value="[state.searchColumn]"
                  @input="setSearchColumn"
                )
              .control
                vstx-search-bar.data-table__search(
                  :value="getSearch"
                  @input="search($event)"
                  :size="options.size"
                )
          //- RowCount
          a.button.is-static(
            v-if="options.totals.isAllowed && options.totals.isVisible.count"
            :class="getSizeClass"
          ) {{ getRowCount }} Rows
          //- Table Settings
          a.button.data-table__settings(
            title="Table Settings"
            @click.passive="toggleOptions"
            v-if="options.settings.isAllowed && options.settings.isVisible"
            :class="getSizeClass"
          )
            slot(name="slot-icon__tableOptions")
              span.icon
                i.fa.fa-table
          //- Column Settings
          a.button.data-table__column-settings(
            title="Column Settings"
            @click.passive="toggleColumnOptions"
            v-if="options.settings.isAllowed && options.settings.isVisible && options.columns.isAllowed"
            :class="getSizeClass"
          )
            slot(name="slot-icon__columnOptions")
              span.icon
                i.fa.fa-columns
          //- Clear Sort
          a.button.data-table__clear-sorts(
            title="Remove All Column Sorting"
            @click.passive="unsort"
            v-if="options.settings.isAllowed && options.settings.isVisible"
            :class="getSizeClass"
          )
            slot(name="slot-icon__clearSort")
              span.icon
                i.fa.fa-sort
          .field.has-addons.is-marginless(v-if="options.settings.isAllowed && options.settings.isVisible && getPagedData.length")
            .control
            //- Download XLSX
            a.button.data-table__download-xlsx(
              :title="`Download as ${state.downloadAs.toUpperCase()}`"
              @click.passive="download(state.downloadAs, getData, filename)"
              :class="getSizeClass"
            )
              slot(name="slot-icon__downloadAs")
                span.icon
                  i.fa.fa-file-excel
            .control
              vstx-select.data-table__select(
                :size="options.size"
                :options="getDownloadOptions"
                :value="[state.downloadAs]"
                @input="state.downloadAs = $event[0]"
              )
          slot(name="slot-post-controls")
    slot(name="slot-description")
    .data-table__filters__active(
      v-if="state.search.length || state.filters.length"
    )
      nav.breadcrumb(aria-label="filters")
        ul
          li Filtering by:&nbsp;&nbsp;
            span.tag.is-primary(v-if="state.search.length") Search: {{ state.search }}
              button.delete(@click="searchRemove", :class="getSizeClass")
            span.tag.is-primary.filter-tag(
              v-for="filter in getFilters"
              :key="getFilterId(filter)"
            )
              span.icon.is-small
                i.fa.fa-filter.fa-xs
              span {{ (filter.text || filter.column) }} : {{ filter.value }}
              button.delete.is-small(
                @click="filterRemove(filter)"
              )
    slot(name="slot-toolbar")
    //- Controls
    table.table.is-narrow.is-relative-position(
      v-bind:class="{'is-overflow-hidden': options.table.overflow, 'is-bordered': options.table.bordered, 'is-striped': options.table.striped, 'is-hoverable': options.table.hoverable, 'is-fullwidth': options.table.fullwidth}"
    )
      //- Settings
      transition(
        name="slideUp"
        @after-leave.passive="setOverflow(false)"
      )
        caption.is-overlay(v-if="options.orderBy.isAllowed && options.orderBy.isVisible")
          //- Settings
          nav.panel
            div.panel-heading
              span Table Settings&nbsp;
              span.is-pulled-right
                //- Edit
                //- Clear Saved State
                //- a.is-warning.button.is-small.options__clearState(title="Clear Custom Settings", @click.passive="deleteSavedSettings")
                //-   span.icon.is-small
                //-     i.fa.fa-times
                //- Unsort
                //- a.is-warning.button.is-small.options__clearState(title="Remove Sorts", @click.passive="unsort")
                //-   span.icon.is-small
                //-     i.fa.fa-times

                //- Close Options
                a.is-danger.button.options__toggleOptions(
                  title="Close Options"
                  @click.passive="toggleOptions"
                  :class="getSizeClass"
                )
                  slot(name="slot-icon__closeTableOptions")
                    span.icon(:class="getSizeClass")
                      i.fa.fa-times

                //- Add Columns
                //- a.is-success.button.is-small.options__addColumn(@click.passive="toggleOptions")
                //-   span.icon.is-small
                //-     i.fa.fa-columns
            //- Totals
            div.panel-block
              .columns.is-multiline
                //- Rows Per Page
                div.column.is-narrow
                  .field.is-grouped.data-table__rowsPerPage
                    p.control.has-icons-left
                      span.select(:class="getSizeClass")
                        select(
                          id="data-table__rows-per-page"
                          v-model.number="options.pagination.rowsPerPage"
                        )
                          option(value="10") 10 Rows Per Page
                          option(value="25") 25 Rows Per Page
                          option(value="50") 50 Rows Per Page
                          option(value="100") 100 Rows Per Page
                          option(value="250") 250 Rows Per Page
                          option(:value="options.pagination.rowsPerPage") {{ options.pagination.rowsPerPage }} Rows Per Page
                      slot(name="slot-icon__rowsPerPage")
                        span.icon.is-left(:class="getSizeClass")
                          i.fa.fa-list
                //- All
                div.column.is-narrow
                  p.control(v-if="options.totals.isAllowed")
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.totals.isVisible.all"
                      )
                      | Show Data Totals
                //- Page
                div.column.is-narrow
                  p.control(v-if="options.totals.isAllowed")
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.totals.isVisible.page"
                      )
                      | Show Page Totals
                //- Rank
                div.column.is-narrow
                  p.control
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.isRanked"
                      )
                      | Show Rank
                //- Filter
                div.column.is-narrow
                  p.control(v-if="options.filter.isAllowed")
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.filter.isVisible"
                      )
                      | Show Filter
                //- All
                div.column.is-narrow
                  p.control(v-if="options.sortIndicator.isAllowed")
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.sortIndicator.isVisible"
                      )
                      | Show Sort Order Numbering
                //- Page
                div.column.is-narrow
                  p.control(v-if="options.totals.isAllowed")
                    label.checkbox
                      input(
                        type="checkbox"
                        v-model="options.totals.isVisible.count"
                      )
                      | Show Row Count
            //- Sorting
            div.panel-block
              .level
                .level-item
                  //- Order By
                  draggable-list(
                    :list="getSortedColumns"
                    @changed.passive="updateOrderBy"
                  )
                    span(slot="slot-title") Order By:&nbsp;&nbsp;
                    template(
                      slot="slot-item"
                      slot-scope="props"
                    )
                      div.draggable__level(v-if="props !== null")
                        span.label.orderByItem(:class="getSizeClass") {{ props.item.name }} {{ props.item.sort.direction }}
                .level-item
                  //- Column Order
                  draggable-list(
                    :list="getDisplayColumns"
                    @changed.passive="updateColumnOrder"
                  )
                    span(slot="slot-title") Column Order:&nbsp;&nbsp;
                    template(
                      slot="slot-item"
                      slot-scope="props"
                    )
                      div.draggable__level(v-if="props !== null")
                        span.label.orderByItem(:class="getSizeClass") {{ props.item.name }}
                .level-item
                  div
                    //- Clear Saved State
                    div
                      a.is-default.button.options__deleteSavedState(
                        title="Delete Saved Settings"
                        @click.passive="deleteSavedSettings"
                        :click="getSizeClass"
                      )
                        slot(name="slot-icon__deleteSavedSettings")
                          span.icon(:class="getSizeClass")
                            i.fa.fa-times
                        span Delete Saved Settings
                    //- br
                    //- //- Remove Sorting
                    //- div
                    //-   a.is-default.button.is-small.options__clearState(title="Remove Sorts", @click.passive="unsort")
                    //-     slot(name="slot-icon__clearSort")
                    //-       span.icon.is-small
                    //-         i.fa.fa-times
                    //-     span Remove Sorting

      thead.fixed-header(:class="{'is-visible': state.isFixedHeaderVisible}")
        //- Header
        tr.column__headers#fixed-column__headers
          th.fixed-column__header-th(v-if="options.isRanked") #
          th.fixed-column__header-th(v-if="options.table.isSelectable")
            label.checkbox(title="Select All")
              input(
                type="checkbox"
                @change="selectAll"
                v-model="state.isSelectAll"
              )
          th.column__header.fixed-column__header-th(
            v-for="(column, idx) in getDisplayColumns"
            :key="`table-header-${idx}`"
            :class="getColumnAlignment(column)"
          )
            //- Slot for Custom Headers
            slot(:name="`${column.field}-header`")
              div
                span(v-if="column['sort']['isSortable'] === true")
                  a(@click.passive="toggleColumnSortDirection(column)") {{ column['name'] }}&nbsp;
                    span.icon(
                      v-if="isSorted(column)"
                      :class="getColumnState(column), getSizeClass"
                    )
                  a.tag(
                    v-if="options.sortIndicator.isVisible && getSortPosition(column) !== -1"
                    @click.passive="toggleColumnSortDirection(column)"
                  ) {{ getSortPosition(column) + 1 }}
                span(v-else="") {{ column['name'] }}&nbsp;
            //- Column Settings
            .column__settings(v-if="options.columns.isAllowed && options.columns.isVisible")
              label.is-6 Format:
              .field.is-grouped.data-table__field.data-table__rowsPerPage
                p.control.has-icons-left
                  span.select(:class="getSizeClass")
                    select(
                      id="column__format"
                      v-model="column.format"
                    )
                      option(value="formatNumber")  Number
                      option(value="formatMoney")  Money
                      option(value="formatPercent")  Percent
                      option(value="formatString")  String
                      option(value="formatDate")  Date
                  slot(name="slot-icon__columnFormat")
                    span.icon.is-left(:class="getSizeClass")
                      i.fa.fa-wrench
              .field.data-table__field
                div.control
                  label.is-6(class="checkbox")
                    input(
                      type="checkbox"
                      v-model="column['sort']['isSortable']"
                    )
                    | &nbsp;Sortable
      thead#static-header
        //- Header
        tr.column__headers
          th(v-if="options.isRanked") #
          th(v-if="options.table.isSelectable")
            label.checkbox(title="Select All")
              input(
                type="checkbox"
                @change="selectAll"
                v-model="state.isSelectAll"
              )
          th.column__header(
            v-for="(column, idx) in getDisplayColumns"
            :key="`table-header-${idx}`"
            :class="getColumnAlignment(column)"
          )
            //- Slot for Custom Headers
            slot(:name="`${column.field}-header`")
              div
                span(v-if="column['sort']['isSortable'] === true")
                  a(@click.passive="toggleColumnSortDirection(column)") {{ column['name'] }}&nbsp;
                    span.icon(
                      v-if="isSorted(column)"
                      :class="getColumnState(column), getSizeClass"
                    )
                  a.tag(
                    v-if="options.sortIndicator.isVisible && getSortPosition(column) !== -1"
                    @click.passive="toggleColumnSortDirection(column)"
                  ) {{ getSortPosition(column) + 1 }}
                span(v-else="") {{ column['name'] }}&nbsp;
            //- Column Settings
            .column__settings(v-if="options.columns.isAllowed && options.columns.isVisible")
              label.is-6 Format:
              .field.is-grouped.data-table__field.data-table__rowsPerPage
                p.control.has-icons-left
                  span.select(:class="getSizeClass")
                    select(
                      id="column__format"
                      v-model="column.format"
                    )
                      option(value="formatNumber")  Number
                      option(value="formatMoney")  Money
                      option(value="formatPercent")  Percent
                      option(value="formatString")  String
                      option(value="formatDate")  Date
                  slot(name="slot-icon__columnFormat")
                    span.icon.is-left(:class="getSizeClass")
                      i.fa.fa-wrench
              .field.data-table__field
                div.control
                  label.is-6(class="checkbox")
                    input(
                      type="checkbox"
                      v-model="column['sort']['isSortable']"
                    )
                    | &nbsp;Sortable
        //- Top Totals
        tr.data-table__total-row(v-if="options.totals.isVisible.all && getPagedData.length > 0")
          td.data-table__row(v-if="options.isRanked"): strong Totals
          td.data-table__row(
            v-for="(column, idx) in getDisplayColumns"
            :key="`table-total-top-${idx}`"
            :class="[getColumnAlignment(column), getWhitespace(column)]"
          )
            data-table-cell(
              v-if="column['format'] !== 'seller' && column['format'] !== 'brand' && column['format'] !== 'product'"
              :column="column"
              :item="state.totals[column['field']]"
            )
      tfoot
        //- Bottom Totals
        tr.data-table__total-row(v-if="options.totals.isVisible.page && getPagedData.length > 0")
          td.data-table__row(v-if="options.isRanked"): strong Page Totals
          td.data-table__row(
            v-for="(column, idx) in getDisplayColumns"
            :key="`table-total-bottom-${idx}`"
            :class="getColumnAlignment(column)"
          )
            data-table-cell(
              v-if="column['format'] !== 'seller' && column['format'] !== 'brand' && column['format'] !== 'product'"
              :column="column"
              :item="getColumnTotal(column, 'page')"
            )
        //- Pagination
        tr(v-if="options.pagination.isAllowed && options.pagination.isVisible")
          td.pagination__controls(:colspan="getColspan")
            nav.pagination.is-left(:class="getSizeClass")
              a.pagination-previous(
                title="Previous Page"
                @click.passive="pageBack"
                :disabled="state.offset - 1 >= 0 ? false : true"
              )
                slot(name="slot-icon__pageBack")
                  i.fa.fa-angle-left
              a.pagination-next(
                title="Next Page"
                @click.passive="pageForward"
                :disabled="state.offset + 1 < getPagination[getPagination.length - 1] ? false : true"
              )
                slot(name="slot-icon__pageForward")
                  i.fa.fa-angle-right
              ul.pagination-list.data-table__pagination-list
                li(
                  class="data-table__pagination-list-item"
                  v-for="i, index in getPagination"
                  :key="`table-pagination-${index}`"
                )
                  a(
                    :title="`Page ${i}`"
                    v-bind:class="{'pagination-ellipsis':isNaN(i),'pagination-link':!isNaN(i),'is-current': i - 1 === state.offset ? true : false}"
                    @click.passive="state.offset = i - 1"
                  ) {{ i }}
      tbody
        tr.is-not-row(v-if="isLoading || state.isLoading")
          td(:colspan="getColspan")
            section.hero.is-medium.is-light
              .hero-body.has-text-centered
                slot(name="loading")
                  p.subtitle &nbsp;Loading...&nbsp;
                    loader(
                      :barCount="parseInt(5)"
                      size="small"
                    )
                slot(name="error")
        //- Unavoidable? Use of v-if with v-for
        tr.is-not-row(v-else-if="getPagination.length > 0 && getPagedData.length === 0")
          td(:colspan="getColspan")
            section.hero.is-medium.is-light
              .hero-body.has-text-centered
                p.subtitle &nbsp;Loading...&nbsp;
                  loader(
                    :barCount="parseInt(5)"
                    size="small"
                  )
        tr(
          v-else-if="getPagedData.length > 0"
          v-for="(item, i) in getPagedData"
          :key="`table-row-${i}`"
          :class="{'is-altered': isAltered(item)}"
        )
          td.data-table__row(
            :class="{'borderless': !options.table.cellbordered}"
            v-if="options.isRanked"
          ) {{ (i + 1) + (state.offset * options.pagination.rowsPerPage) }}
          td.data-table__row(
            v-if="options.table.isSelectable"
            :class="{'borderless': !options.table.cellbordered}"
          )
            label.checkbox(title="`Select${'name' in item ? ' ' + item.name : ''}`")
              input(
                type="checkbox"
                :checked="isSelected(item)"
                @change="select(item)"
              )
          td.data-table__row(
            v-for="(column, idx) in getDisplayColumns"
            :key="`table-column-${idx}`"
            :class="[getColumnAlignment(column), getWhitespace(column)]"
          )
            //- Slot for Custom Fields
            slot(:name="column.sort.sortByField ? column.sort.sortByField : column.field")&attributes({':item': 'item', ':index': 'i', ':column': 'column'})
              data-table-cell()&attributes({'@onFilter': 'onFilterClick($event)', ':item': 'item', ':index': 'i', ':column': 'column'})
</template>

<script>
// Sass?
// import './sass/vstxDataTable.sass'
// Libraries
// import localForage from 'localforage'
import joi from 'joi'
import md5 from 'md5'
import { sortBy, filter, forEach, throttle, indexOf, differenceWith, isEqual, merge, cloneDeep, isDate, isNumber, round, isNil, get, isString } from 'lodash'

// Components
import DataTableCell from './vstxDataTableCell.vue'
import SearchBar from 'vstx-search-bar'
import Select from 'vstx-select'
import Loader from 'vstx-loader'
import DraggableList from 'vstx-draggable-list'
// Mixins
// import { csvMixin } from './mixins/csvMixin'
import { selectMixin } from './mixins/selectMixin'
import { searchFilterMixin } from './mixins/searchFilterMixin'
// Constants
import { defaults } from './constants/defaults' // The defaults should be set here so they can used for the merge function and the prop defaults.
import { schemas } from './constants/schemas' // Joi Validation Schemas

export default {
  name: 'data-table',
  introduction: 'A data table component for the Vue Stacks Template',
  description: '',
  token: `data-table-cell()&attributes({:payload: 'payload', :options: 'options'})`,
  props: {
    payload: {
      note: 'An Array of Objects of the DATA__ROW class.',
      type: Array,
      required: false,
      default: () => { return [] },
      validator: value => {
        return joi.validate(value, schemas.payload.schema, (err) => {
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
        return joi.validate(value, schemas.configuration.schema, (err) => {
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
        return joi.validate(value, schemas.columns.schema, schemas.columns.options, (err) => {
          return err ? () => { throw err } : true
        })
      }
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    filename: {
      type: String,
      required: false,
      default: `export-${new Date().toISOString().split('T')[0]}`
    },
    altered: {
      note: 'An array of payload indexes that have been altered.',
      type: Array,
      required: false,
      default: () => { return [] },
      validator: value => {
        return joi.validate(value, schemas.altered.schema, schemas.altered.options, (err) => {
          return err ? () => { throw err } : true
        })
      }
    },
    filters: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    id: {
      note: '',
      type: String,
      default: () => { return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) }
    }
  },
  mixins: [selectMixin, searchFilterMixin],
  components: {
    'data-table-cell': DataTableCell,
    'draggable-list': DraggableList,
    'loader': Loader,
    'vstx-search-bar': SearchBar,
    'vstx-select': Select
  },
  created () {
    this.configure()
    this.assignUniqueID()
    this.loadSavedSettings()
    this.filterAndSearch(this.getPayload)
  },
  mounted () {
    if (this.options.table.hasFixedHeaders) {
      window.addEventListener('scroll', this.throttledScroll, {
        passive: true
      })
    }
  },
  destroyed () {
    if (this.options.table.hasFixedHeaders) {
      window.removeEventListener('scroll', this.handleScroll)
    }
    // Persist State to LocalStorage
    // localForage.setItem(this.uniqueID, {
    //   state: this.state,
    //   options: this.options
    // })
  },
  data () {
    return {
      uniqueID: '',
      state: {
        isLoading: false,
        scroll: {},
        hasScrolled: false,
        isScrolled: false,
        isFixedHeaderVisible: false,
        allowWorkers: false,
        data: [],
        columns: [],
        // SelectMixin
        selected: [],
        isSelectAll: false,
        // End
        // SearchFilterMixin
        filters: [],
        search: '',
        offset: this.getConfiguration().settings.offset,
        // End
        // TotalsMixin
        hasCalculatedTotals: false,
        totals: {},
        // End,
        dimmed: false,
        downloadAs: 'xlsx'
      },
      options: this.getConfiguration()
    }
  },
  computed: {
    getDownloadOptions () {
      const options = [
        {value: 'xlsx', text: 'XLSX'},
        {value: 'csv', text: 'CSV'}
      ]
      return 'downloadAs' in options && options.downloadAs ? options.downloadAs : options
    },
    getSizeClass () {
      return {
        'is-small': this.options.size === 'small',
        'is-normal': this.options.size === 'normal',
        'is-medium': this.options.size === 'medium',
        'is-large': this.options.size === 'large'
      }
    },
    getRowCount () {
      if ((this.state.search.length || this.state.filters.length) && this.state.data.length > 0) {
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
      let colspan = this.state.columns.length
      if (this.options.isRanked) {
        colspan++
      }
      if (this.options.table.isSelectable) {
        colspan++
      }
      return colspan
    },
    getColumns () {
      return sortBy(this.state.columns, [ (c) => { return c.position } ])
    },
    getColumnOptions () {
      let options = [{
        value: 'all',
        text: 'All Columns'
      }]
      forEach(this.getColumns, (column) => {
        options.push({
          value: (column.field),
          text: column.name
        })
      })
      return options
    },
    getDisplayColumns () {
      return sortBy(filter(this.state.columns, 'isVisible'), [ (c) => { return c.position } ])
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
      if ((this.state.search.length || this.state.filters.length) && this.state.data.length > 0) {
        data = this.state.data
      } else {
        data = this.getPayload
      }
      let totalPages = Math.ceil(data.length / this.options.pagination.rowsPerPage)
      let returnData = []
      let min = (this.state.offset - 4 < 0 ? 0 : this.state.offset - 4)
      let pagesShown = 10
      let max = min + pagesShown
      let i = 0
      while (i < totalPages) {
        if ((returnData.length < this.listPages && this.state.offset === 0) || (i >= min && i <= max)) {
          returnData.push(i + 1)
        }
        i++
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
      let topColumns = []
      let columns = []
      let directions = []
      let columnFields = []
      forEach(this.getSortedColumns, (value) => {
        if (value.sort.direction !== '') {
          topColumns.push((!isNil(value.sort.sortByColumn) ? value.sort.sortByColumn : value.field))
          let column = (!isNil(value.sort.sortByField) ? value.sort.sortByField : value.field)
          columnFields.push(column)
          let sortByColumn = ''
          if (value.format === 'formatString') {
            sortByColumn = (item) => {
              if (isNil(item[column])) {
                let value = get(item, column)
                return isString(value) ? value.toLowerCase() : value
              } else if (item[column].hasOwnProperty('toLowerCase')) {
                return item[column].toLowerCase()
              } else {
                return item[column]
              }
            }
          } else {
            sortByColumn = (item) => {
              if (isNil(item[column])) {
                return get(item, column)
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
        columnFields,
        columns,
        directions
      }
      return data
    }
  },
  methods: {
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    throttledScroll: throttle(function (e) {
      this.state.scroll = e
      this.handleScroll()
    }, 250, {
      'trailing': true
    }),
    query (selector, context) {
      context = context || document
      // Redirect simple selectors to the more performant function
      if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
        switch (selector.charAt(0)) {
          case '#':
            // Handle ID-based selectors
            return [context.getElementById(selector.substr(1))]
          case '.':
            // Handle class-based selectors
            // Query by multiple classes by converting the selector
            // string into single spaced class names
            var classes = selector.substr(1).replace(/\./g, ' ')
            return [].slice.call(context.getElementsByClassName(classes))
          default:
            // Handle tag-based selectors
            return [].slice.call(context.getElementsByTagName(selector))
        }
      }
      // Default to `querySelectorAll`
      return [].slice.call(context.querySelectorAll(selector))
    },
    getPosition (element) {
      let xPosition = 0
      let yPosition = 0
      while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
        element = element.offsetParent
      }
      return { x: xPosition, y: yPosition }
    },
    handleScroll () {
      let id = this._uid
      const dataTable = this.query(`#data-table-${id}`)[0]
      const fixedHeadRow = this.query(`#data-table-${id} #fixed-column__headers`)[0]
      const headColumns = this.query(`#data-table-${id} .fixed-column__header-th`)
      const firstColumns = this.query(`#data-table-${id} .data-table.is-scrolled tbody tr:first-of-type td`)
      const headers = this.query(`#data-table-${id} #static-header`)[0]
      // const firstRow = document.querySelector('.data-table tbody tr:first-of-type')
      const offset = this.getPosition(headers)
      const yOffset = offset.y
      const xOffset = offset.x
      const isScrolled = (((window.scrollY + this.options.offsetTop) >= yOffset) && this.options.table.hasFixedHeaders && this.getPagedData.length > 0)
      if (isScrolled) {
        if (!isNil(fixedHeadRow)) {
          fixedHeadRow.style.transform = `translateX(${dataTable.scrollLeft * -1}px)`
          fixedHeadRow.style.paddingLeft = xOffset + 'px'
        }
        if (!isNil(headColumns) && headColumns.length && !isNil(firstColumns) && firstColumns.length) {
          for (let i = 0; i < headColumns.length; i++) {
            let el = headColumns[i]
            if (!isNil(firstColumns[i])) {
              el.style.minWidth = `${firstColumns[i].clientWidth}px`
            }
          }
          if (this.state.isFixedHeaderVisible === false) {
            this.state.isFixedHeaderVisible = true
          }
        } else {
          this.state.isFixedHeaderVisible = false
        }
      }
      if (!isScrolled) {
        this.state.isFixedHeaderVisible = false
      }
      this.state.isScrolled = isScrolled
    },
    // Helpers
    configure () {
      this.populateColumnsFromPayload()
      this.collapsePages()
      this.checkRequiresPagination()
      if (this.options.totals.isVisible.all) {
        this.computeTotals()
      }
    },
    download (type, data) {
      this.$emit('downloadData', {data, type})
    },
    populateColumnsFromPayload () {
      if (isNil(this.state.columns) || this.state.columns.length === 0) {
        if (isNil(this.columns) || this.columns.length === 0) {
          let firstRow = this.payload[0]
          let rowKeys = Object.keys(firstRow)
          let columns = []
          forEach(rowKeys, (k, i) => {
            let columnName = k
            let firstValue = firstRow[columnName]
            let columnFormat = 'formatString'
            let alignment = 'left'
            if (isNumber(firstValue) === true) {
              alignment = 'right'
              if (columnName.toLowerCase().includes('percent') || columnName.includes('%')) {
                columnFormat = 'formatPercent'
              } else if (this.getDecimalPlaces(firstValue) === 2 || columnName.includes('$') || columnName.includes('dollar')) {
                columnFormat = 'formatMoney'
              } else {
                columnFormat = 'formatNumber'
              }
            } else if (isDate(firstValue) === true) {
              columnFormat = 'formatDate'
            }
            let column = {
              name: k,
              format: columnFormat,
              field: k,
              align: alignment,
              position: i,
              isVisible: true,
              sort: {
                isSortable: true,
                direction: '',
                order: i
              }
            }
            columns.push(column)
          })
          this.state.columns = columns
        } else {
          let mergedColumns = []
          const defaultColumn = {
            name: '',
            format: 'formatString',
            field: '',
            align: 'left',
            position: 0,
            isVisible: true,
            sort: {
              isSortable: true,
              direction: '',
              order: 0
            }
          }
          for (let i = 0; i < this.columns.length; i++) {
            let thisDefaultColumn = cloneDeep(defaultColumn)
            thisDefaultColumn.position = i
            thisDefaultColumn.sort.order = i
            const mergedColumn = merge(thisDefaultColumn, this.columns[i])
            mergedColumns.push(mergedColumn)
          }
          this.state.columns = mergedColumns
        }
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
    assignUniqueID () {
      let thisHash = md5(`${this.id}`)
      this.uniqueID = thisHash
    },
    getConfiguration () {
      let defaultsCopy = cloneDeep(defaults)
      let configuration = merge(defaultsCopy.configuration, this.configuration)
      return configuration
    },
    // Options Helpers
    setOverflow (boolean) {
      this.options.table.overflow = boolean
    },
    toggleColumnOptions () {
      if (this.options.columns.isVisible === true) {
        this.setOverflow(false)
        this.options.columns.isVisible = false
      } else {
        this.setOverflow(true)
        this.options.columns.isVisible = true
      }
    },
    toggleOptions () {
      if (this.options.orderBy.isVisible === true) {
        this.setOverflow(false)
        this.options.orderBy.isVisible = false
      } else {
        this.setOverflow(true)
        this.options.orderBy.isVisible = true
      }
    },
    openColumnOptions: throttle(() => {
      // this.setOverflow(true)
      this.options.columns.isVisible = true
    }, 500),
    closeColumnOptions: throttle(() => {
      this.options.columns.isVisible = false
    }, 500),
    openOptions: throttle(() => {
      // this.setOverflow(true)
      this.options.orderBy.isVisible = true
    }, 500),
    closeOptions: throttle(() => {
      this.options.orderBy.isVisible = false
    }, 500),
    // UDF
    getDecimalPlaces (num) {
      var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
      if (!match) {
        return 0
      }
      return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
      )
    },
    // Settings
    deleteSavedSettings () {
      // localForage.removeItem(this.uniqueID)
    },
    loadSavedSettings () {
      // localForage.getItem(this.uniqueID).then((value) => {
      //   if (isNil(value)) {
      //     localForage.setItem(this.uniqueID, {
      //       state: this.state,
      //       options: this.options
      //     })
      //   } else {
      //     this.state = value.state
      //     this.options = value.options
      //   }
      // })
    },
    // Sorting
    toggleColumnSortDirection (column) {
      let sortedColumns = 0
      let wasUnsorted = false
      let thisCol = {}
      forEach(this.getDisplayColumns, (thisColumn) => {
        const hasSortBy = 'sort' in column && 'sortByField' in column.sort
        const field = hasSortBy ? column.sort.sortByField : column.field
        const columnField = hasSortBy ? thisColumn.sort.sortByField : thisColumn.field
        if (columnField === field) {
          thisCol = thisColumn
          if (thisColumn.sort.direction === 'asc') {
            thisColumn.sort.direction = 'desc'
          } else if (thisColumn.sort.direction === 'desc') {
            thisColumn.sort.direction = ''
          } else if (thisColumn.sort.direction === '') {
            wasUnsorted = true
            thisColumn.sort.direction = 'asc'
          }
        }
        if (thisColumn.sort.direction !== '' && thisColumn.sort.isSortable) {
          sortedColumns++
        }
      })
      if (sortedColumns === 1 && wasUnsorted) {
        this.updateOrderBy([thisCol])
      }
    },
    isSorted (column) {
      return this.getSortDirection(column) === 'asc' || this.getSortDirection(column) === 'desc'
    },
    getSortDirection (column) {
      let direction = this.getOrderBy.directions[this.getSortPosition(column)]
      return direction
    },
    getSortPosition (column) {
      let position = indexOf(this.getOrderBy.columnFields, ('sort' in column && 'sortByField' in column.sort ? column.sort.sortByField : column.field))
      return position
    },
    unsort () {
      forEach(this.getSortedColumns, (value) => {
        value.sort.direction = ''
      })
    },
    updateOrderBy (columns) {
      let lastIndex = 0
      forEach(columns, (column, i) => {
        column.sort.order = i
        lastIndex = i
      })
      let diff = differenceWith(this.state.columns, columns, isEqual)
      forEach(diff, (d, i) => {
        d.sort.order = lastIndex + i + 1
        columns.push(d)
      })
      this.state.columns = columns
    },
    updateColumnOrder (columns) {
      forEach(columns, (column, i) => {
        column.position = i
      })
      this.state.columns = columns
    },
    // Totals
    getColumnTotal (column, scope) {
      let total = 0
      let isTotalable = !(
        column['format'] === 'formatString' ||
        column['format'] === '' ||
        isNil(column['format'])
      )
      if (isTotalable) {
        let data = (scope === 'page' ? this.getPagedData : this.getPayload)
        forEach(data, (row) => {
          total = total + row[column['field']]
        })
        // Why?
        if (column['format'] === 'formatPercent') {
          total = round(total / data.length, 2)
        }
      } else {
        total = ''
      }
      return {
        'id': 1,
        'value': round(total, 2),
        'type': 'total'
      }
    },
    getWhitespace (column) {
      const ws = column['whitespace']
      return {
        'ws-no-wrap': ws === 'nowrap',
        'ws-inherit': ws === 'inherit',
        'ws-initial': ws === 'initial',
        'ws-normal': ws === 'normal',
        'ws-pre': ws === 'pre',
        'ws-pre-line': ws === 'pre-line',
        'ws-pre-wrap': ws === 'pre-wrap',
        'ws-unset': ws === 'unset'
      }
    },
    computeTotals () {
      let isTotalable = true
      if (this.options.totals.isVisible.all) {
        forEach(this.state.columns, (column) => {
          let total = 0
          isTotalable = !(column['format'] === 'formatString' || column['format'] === '')
          if (isTotalable) {
            forEach(this.payload, (row) => {
              total = total + row[column['field']]
            })
            let value = total
            if (column['format'] === 'formatPercent') {
              value = value / this.payload.length
            }
            let item = {
              'id': 1,
              'value': round(value, 2),
              'type': 'total'
            }
            this.state.totals[column['field']] = item
          } else {
            this.state.totals[column['field']] = {
              'id': 1,
              'value': 'N/A',
              'type': 'total'
            }
          }
        })
      }
    },
    // Layout & UI
    getColumnAlignment (column) {
      let alignment = `has-text-${column['align']}`
      let classes = {}
      classes[alignment] = true
      classes.borderless = !this.options.table.cellbordered
      return classes
    },
    getColumnState (column) {
      let state = {
        'column__sort-indicator-asc': this.getSortDirection(column) === 'asc',
        'column__sort-indicator-desc': this.getSortDirection(column) === 'desc'
      }
      return state
    },
    // Pagination
    pageBack () {
      this.state.offset = this.state.offset - 1 >= 0 ? this.state.offset - 1 : 0
    },
    pageForward () {
      this.state.offset = this.state.offset + 1 < this.getPagination[this.getPagination.length - 1] ? this.state.offset + 1 : this.getPagination[this.getPagination.length - 1] - 1
    }
    // onTableClick (event) {
    //   let headers = document.getElementsByClassName('column__header')
    //   let target = event.target
    //   let clickedHeader = {}
    //   forEach(headers, (header) => {
    //     if (event.target === header) {
    //       clickedHeader = header
    //     }
    //   })
    // }
  },
  watch: {
    'options': {
      handler: function () {
        this.$emit('onOptionsChange', this.options)
      },
      deep: true
    },
    'state.columns': {
      handler: function () {
        this.$emit('onColumnChange', this.state.columns)
      },
      deep: true
    },
    'options.totals.isVisible.all' () {
      // Calculate Totals Only when Necessary
      if (!this.state.hasCalculatedTotals) {
        this.computeTotals()
      }
    },
    'isLoading' () {
      if (this.isLoading) {
        this.state.data = []
        this.state.search = ''
        this.state.filters = []
        this.state.hasCalculatedTotals = false
        this.state.totals = {}
        this.state.offset = 0
        this.state.columns = []
        this.options.totals.isVisible.all = false
        this.computeTotals()
      }
    }
  }
}
</script>

<style lang="stylus">
  .data-table
    overflow-x auto
    min-height 20rem
  .data-table .table
    background none
  .data-table .data-table__controls
    padding-top 0.5rem
  .data-table .data-table__controls .column.is-narrow
    padding-left 0
    padding-right 0
  .data-table .data-table__field
    padding-bottom 5px
  .data-table .column__settings
    position absolute
    top 32px
    left 0px
    width 100%
    background white
    padding 5px
    border-bottom: 1px solid #eeeeee
    box-shadow: 3px 3px 2px 0px rgba(0,0,0,0.15)
    z-index 9
  .data-table .title-column
    padding-right 2.5rem !important
  .data-table .column__headers
    white-space: nowrap
  // .table th.column__header.has-text-left
  //   padding-left 0
  // .table th.column__header.has-text-right
  //   padding-right 0
  .data-table .column__header
    position relative
    right 2px
  .data-table .inline-block
    display: inline-block
  .data-table .level.data-table__head
    margin-bottom 10px
  .data-table .level.data-table__head .columns .column
    padding 0.5rem 0.75rem
  .data-table caption
    background-color white
    z-index 99
    border grey
  .data-table caption.is-overlay
    margin-top 34px
  .data-table .is-relative-position
    position relative
    border 0
    padding 0
  .data-table .table
    overflow auto
  .data-table .table.is-overflow-hidden
    overflow hidden
    min-height 15rem
  .data-table .is-min-height-100
    min-height 100px
  .data-table .column--state-active
    @extend .is-active !optional
  .data-table .column__sort-indicator
    font-size .75em
    if $orange is defined
      color $orange
    else
      color #FF6700
  .data-table .column__sort-indicator-asc:after
    @extend .data-table .column__sort-indicator
    content " \25B2"
  .data-table .column__sort-indicator-desc:after
    @extend .data-table .column__sort-indicator
    content " \25BC"
  .data-table .data-table__pagination-list
    list-style none
    margin-left 0
    margin-right 0
    margin-top 0
    margin-bottom 0
  .data-table .data-table__pagination-list-item
    margin-top 0em
    font-size font-size
  .data-table .pagination, .pagination-list
    justify-content left
  .data-table .pagination-link
    margin 3px
  .data-table .pagination-link:first-of-type
    margin-left 0
  .data-table .data-table__pagination-list-item a.pagination-link:not(.is-current)
    background: white
  .data-table .data-table__search
    margin-right 5px
  .data-table .data-table__select
    margin 0
  .data-table .pagination-next
    background white
  .data-table .pagination-previous
    background white
  .data-table .pagination__controls .columns .column
    background-color: $light-grey
    margin-right 8px
  .data-table .data-table__search.field
    margin-bottom 0
  .data-table .data-table__settings
    margin-left 0px
  .data-table .data-table__row
    font-size .85rem
  .data-table .data-table__rowsPerPage.field
    margin-bottom 0
  .data-table .data-table__rowsPerPage .control.has-icons-left .icon, .data-table .data-table__rowsPerPage .control.has-icons-right .icon
    width 1rem
    height 1rem
    top 6px
    left 6px
  .data-table .filter-tag
    padding 0 0.25rem 0 0.5rem
  .data-table .filter-tag:nth-of-type(1) ~ .filter-tag
    margin-left 0.25rem
  .data-table .filter-tag .delete
    margin-left 0.35rem
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
  .data-table__filters__active
    padding-bottom 10px
    .tag:not(body) .delete
      margin-right 0

  // Custom Label CSS
  // Example:
  /*
    span.label.is-small Hello Label
      a.delete.is-small
  */
  .data-table span.label
    font-size 1rem
    font-weight: normal
    margin 2px 5px
    padding 1px 3px
    background #fafafa
    border 1px solid #cccccc
  .data-table span.label
    font-size .75rem
    padding 3px 6px
    margin 0 2px;
  .data-table span.label button.delete
    margin-left 6px
    top 1px
  .data-table .table td.borderless, .table th
    border 0px
  .data-table .is-altered:after
    content '\00AB '
    color red
    font-weight 800

// Fixed Header
.data-table.is-scrolled thead.fixed-header tr
  display block
  padding 0 0.75rem
.data-table.is-scrolled thead.fixed-header tr th
  padding 0.25em 0.5em
.data-table thead.fixed-header
  position fixed
  z-index 5
  top 0rem
  left 0
  right 0
  width 100%
  height 1.5rem
  line-height 2rem
  display table
  background-color rgba(255, 255, 255, 1)
  box-shadow 3px 3px 2px 0px rgba(0,0,0,0.075)
  visibility hidden
.data-table.is-scrolled thead.fixed-header.is-visible
  visibility visible
// .data-table.is-scrolled thead.fixed-header tr.column__headers
//   will-change transform

// Whitespace Control
.data-table .ws-no-wrap
  white-space nowrap
.data-table .ws-inherit
  white-space inherit
.data-table .ws-initial
  white-space initial
.data-table .ws-normal
  white-space normal
.data-table .ws-pre
  white-space pre
.data-table .ws-pre-line
  white-space pre-line
.data-table .ws-pre-wrap
  white-space pre-wrap
.data-table .ws-unset
  white-space unset
.data-table tr.is-not-row, .data-table tr.is-not-row:hover
  background none
.table.is-hoverable.is-striped tbody tr.is-not-row:not(.is-selected):hover
  background none
</style>
