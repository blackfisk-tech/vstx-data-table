# VueStacks.com Data-Table

### About:
The VSTX Data Table is a powerful data grid component (Vue.js 2.4+) for displaying, sorting, searching, filtering, and interacting with large and deeply nested data sets. As simple as passing a Prop containing an array of objects, as complex you need it to be.

> Theme (Look & Feel):
> We rely on the Bulma (https://bulma.io/) CSS framework and FontAwesome icons for themeing. These are needed for the component to display properly. Support for other CSS frameworks like Bootstrap can be achieved using additional CSS. Other icon sets can currently be used by overriding the icons with named slots.

### Current Features
 - Deep (nested) Sorting, Filtering, and Searching by All/Column
 - Multi-Column Sorts with Sort By configuration
 - Works with large datasets (Tested with 25k rows of complex nested objects)
 - Customize Row/Column/Cell content using Vue.js Named & Scoped Slots
 - Customize Title, Description, Icons, Loading Animation, Errors, and more using Slots
 - Selectable rows with @onSelect event
 - Built-in Loading animation controlled through Prop
 - Client-side exports of data to CSV and Excel
 - Optional Column Totals by Page & All
 - Automatic Pagination with configurable page size
 - On-page configurations for Column Position, Sort Order, and much more
 - Configuration Prop input and Emits configuration change events to support configuration persistence
 - Built-in Filters for Outputting Money, Numbers, and Dates (including timezone support)
 - Support for Custom Filters with multiple parameters
 - Text Replacement for variable Links
 - Hidden Columns

### Roadmap
 - Move thread-expensive Filtering to Web Worker to reduce UI blocking
 - Add Weighted Multi-Column Sorting
 - Abstract the CSS layer for supporting any CSS Framework/Icon Set
 - Improve mobile support (Fixed headers and first column)
 - Add Calculated Fields using basic Sum/Averages Formulas (can currently be achieved using Slots)
 - Extend support for higher level math/formula functions
 - Incorporate [Native Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in our 2.0 release
 - Build testing suite for both UX/UI & low level support for testing formulas/math functions
 - ~~Support Complex Objects in Sort, Filter, and Search~~
 - ~~Export to CSV/XLSX~~
 - ~~Multi-column Sorting~~
 - ~~Selectable Rows~~ 

### Demo
![alt text][example-table-1]

[example-table-1]: example-table-1.PNG "Example Preview of Data Table"
A live demo can be found at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table). This is still a work in progress and over the next few months we plan on adding dozens of features such as Data-fetching, caching, user preference persistance, data-table report collections, live data editing and much more!

### Installation

```
npm install vstx-data-table
```

### Usage

> We use pug & stylus in all of our code and examples. Please make adjustments if you wish you get the example below to work without installing support for pug or stylus.
> The below example will render a simple data-table with 3 columns. More complex examples are available at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table)


```javascript
<template lang="pug">
  .sample-data-table
    data-table(
      :payload="data"
    )
</template>
<script>
import DataTable from 'vstx-data-table'

export default {
  name: 'SampleReport',
  components: {
    'data-table': DataTable
  },
  data () {
    return {
      data: [
        {id: 1, title: 'row1', amount: 1},
        {id: 2, title: 'row2', amount: 2},
        {id: 3, title: 'row3', amount: 3},
        {id: 4, title: 'row4', amount: 4}
      ]
    }
  }
}
</script>
<style lang="stylus">
</style>
```

### Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

> You can also contribute, ask us questions, or suggest features by emailing us at [dev@blackfisk.com](mailto:dev@blackfisk.com)
> We are actively changing this data-table in our operations daily so please help us improve its usability.

### History
- 0.1.4 - Added Web Worker option in Filtering to reduce UI blocking
- 0.1.2 - Updated Documentation, Added Default formatDate filter with Timezone support
- 0.1.1 - Altered Search Bar behavior from Automatic to Manual (on Enter, on Click)
- 0.1.0 - Deep Sorting and Deep Filtering configurations added to Columns prop Column Schema
- 0.0.58 - Reenabled CSV Exports, Added Deep Column Filtering
- 0.0.57 - Added Excel exporting support, speed optimization to support even larger datasets & bug fixes
- 0.0.51 - Added Bulma Size support, basic Mobile formatting
- 0.0.48 - Table Filters as props, built-in Vue Filters (formatString, formatDate, formatMoney, formatNumber, formatPercent)
- 0.0.43 - Fixed issue with CSV Exporting for large data-sets

> This data-table project was built to support a need Blackfisk.com had however we quickly realized it needed to be open-sourced to help the community.
> [Jeremy R DeYoung](mailto:jeremy@blackfisk.com) initial built the foundation
> [Daniel Berg](mailto:daniel@blackfisk.com) is currently primary contributor to this project

### License

> All code provided within is licensed with a [GNU GPLv3 License](https://www.gnu.org/licenses/quick-guide-gplv3.en.html)
