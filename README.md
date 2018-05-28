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
 - Support for Custom Filters with *n* parameters
 - Text Replacement for variable Links
 - Hidden Columns
 - (Optional) Web Worker support for Filtering, Sorting, and Slicing data

### Roadmap
 - Add Vue CLI 3.0 support with full cli integration
 - Add Weighted Multi-Column Sorting
 - Abstract the CSS layer for supporting any CSS Framework/Icon Set
 - Improve mobile support (~~Fixed headers~~ and first column)
 - Add Calculated Fields using basic Sum/Averages Formulas (can currently be achieved using Slots)
 - Extend support for higher level math/formula functions
 - Incorporate [Native Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in our 2.0 release
 - Build testing suite for both UX/UI & low level support for testing formulas/math functions
 - ~~Move thread-expensive Filtering, Sorting, and Slicing to Web Workers to reduce UI blocking~~
 - ~~Support Complex Objects in Sort, Filter, and Search~~
 - ~~Multi-column Sorting~~
 - ~~Selectable Rows~~
 - ~~Manage dependencies as externals~~
 - ~~Treeshake lodash in build~~

## Example Directory
> We've build a fully axios enabled data-table example ready to install.
> Clone this project locally and run `npm install` in the `./examples/` directory
> And to view the live project, run `npm run serve` to see the fully working version.

### Demo
![alt text][example-table-1]

[example-table-1]: example-table-1.PNG "Example Preview of Data Table"
A live demo can be found at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table). This is still a work in progress and over the next few months we plan on adding dozens of features such as Data-fetching, caching, user preference persistence, data-table report collections, live data editing and much more!

### Installation

```
npm install vstx-data-table
```

### Usage

> We use pug & stylus in all of our code and examples. Please make adjustments if you wish you get the example below to work without installing support for pug or stylus.
> The below example will render a simple data-table with 3 columns, a custom title via slot, and for 2/3 columns a customized presentation of header and cell content via slots. More complex examples are available at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table)


```vue
<template lang="pug">
  #app
    .sample-data-table.container
      vstx-data-table(
        :payload="payload"
        :configuration="configuration"
      )
        //- SLOT: Table Title
        template(slot="slot-title")
          div
            h1.title.has-text-link Data Table Example
        //- SLOTS: Title Column
        template(slot="title-header", slot-scope="table")
          span.has-text-danger Titles
        template(slot="title", slot-scope="table")
          span.has-text-success {{ table.item.title }}
        //- SLOTS: Amount
        template(slot="amount-header", slot-scope="table")
          span.has-text-warning $
        template(slot="amount", slot-scope="table")
          em.has-text-info ${{ table.item.amount.toFixed(2) }}
    custom

</template>

<script>
<!-- Import Bulma for Base Styling -->
import 'bulma/css/bulma.css'
<!-- Import FontAwesome Icons -->
import Fontawesome from '@fortawesome/fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faTable from '@fortawesome/fontawesome-free-solid/faTable'
import faColumns from '@fortawesome/fontawesome-free-solid/faColumns'
import faSort from '@fortawesome/fontawesome-free-solid/faSort'
import faFileExcel from '@fortawesome/fontawesome-free-solid/faFileExcel'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faList from '@fortawesome/fontawesome-free-solid/faList'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft'
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight'

Fontawesome.library.add(faSearch)
Fontawesome.library.add(faTable)
Fontawesome.library.add(faColumns)
Fontawesome.library.add(faSort)
Fontawesome.library.add(faFileExcel)
Fontawesome.library.add(faTimes)
Fontawesome.library.add(faList)
Fontawesome.library.add(faWrench)
Fontawesome.library.add(faAngleLeft)
Fontawesome.library.add(faAngleRight)
<!-- Import Vue and the DataTable, Install -->
import Vue from 'vue'
import VstxDataTable from 'vstx-data-table'
Vue.use(VstxDataTable)

export default {
  name: 'app',
  data () {
    return {
      configuration: {
        table: {
          fullwidth: true
        }
      },
      payload: [
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
- 0.2.13 - Updated documentation and support for async web components/web workers and bug fixes
- 0.2.5  - Removed DownloadAs functionality (will be released as separate module to take advantage of dependency bundling)
- 0.2.4  - Improved Performance by reducing Lodash, Fontawesome, other dependencies and improving build process
- 0.2.3  - Web Worker support in Filtering, Sorting, and Pagination
- 0.2.0  - Added Web Worker option in Filtering to reduce UI blocking
- 0.1.2  - Updated Documentation, Added Default formatDate filter with Timezone support
- 0.1.1  - Altered Search Bar behavior from Automatic to Manual (on Enter, on Click)
- 0.1.0  - Deep Sorting and Deep Filtering configurations added to Columns prop Column Schema
- 0.0.58  - Enabled CSV Exports, Added Deep Column Filtering
- 0.0.57  - Added Excel exporting support, speed optimization to support even larger datasets & bug fixes
- 0.0.51  - Added Bulma Size support, basic Mobile formatting
- 0.0.48  - Table Filters as props, built-in Vue Filters (formatString, formatDate, formatMoney, formatNumber, formatPercent)
- 0.0.43  - Fixed issue with CSV Exporting for large data-sets

> This data-table project was built to support a need Blackfisk.com had however we quickly realized it needed to be open-sourced to help the community.
> [Jeremy R DeYoung](mailto:jeremy@blackfisk.com) initially built the foundation
> [Daniel Berg](mailto:daniel@blackfisk.com) is currently primary contributor to this project

### License

> All code provided within is licensed with a [GNU GPLv3 License](https://www.gnu.org/licenses/quick-guide-gplv3.en.html)
