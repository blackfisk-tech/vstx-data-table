# VueStacks.com Data-Table

> vstx-data-table is a powerful data grid that currently supports Vue.js 2.4+ however we are actively working on support native web components in future releases.
> Currently vstx-data-table is built support bulma framework however with a few tweaking/extending of the css, other frameworks such as bootstrap can be supported.

## Current Features
 - Sort multiple columns
 - Slot content overrides at the row/column/cell levels
 - Calculated fields using basic sum/averages formulas
 - On-page configs for column position
 - Config change call backs for data-configuration persistance
 - Pagination
 - Data-Totals by Page & by Total All Data
 - In-Data filtering
 - Callback requerying filtering data to provide a new data-set
 - Hidden Columns
 - Support for data-sets with over 5k records
 - Client-size exporting of data in CSV

## Roadmap
 - Abstract the CSS layer to make is support any css framework
 - Extend support for higher level math/formula functions
 - Incorporate [Native Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in our 2.0 release
 - Build testing suite for both UX/UI & low level support for testing formulas/math functions

## Demo
![alt text][example-table-1]

[example-table-1]: example-table-1.jpg "Example Preview of Data Table"
A live demo can be found at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table). This is still a work in progress and over the next few months we plan on adding dozens of features such as Data-fetching, caching, user preference persistance, data-table report collections, live data editing and much more!

## Installation

```
npm install vstx-data-table
```

## Usage

> We use pug & stylus in all of our code and examples. Please make adjustments if you wish you get the example below to work without installing support for pug or stylus.
> The below example will render a simple data-table with 3 columns. More complex examples are available at [www.vuestacks.com/data-table](https://www.vuestacks.com/data-table)


```html
<template lang="pug">
```
```css
  .sample-data-table
    data-table(
      :payload="data",
      :filename="`sample-export.csv`"
    )
```
```html
</template>
<script>
```
```javascript
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
```
```html
</script>
<style lang="stylus">
</style>
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

> You can also contribute, ask us questions, or suggest features by emailing us at [dev@blackfisk.com](mailto:dev@blackfisk.com)
> We are actively changing this data-table in our operations daily so please help us improve its usability.

## History
- 0.0.43 - Fixed issue with CSV Exporting for large data-sets

> This data-table project was built to support a need Blackfisk.com had however we quickly realized it needed to be open-sourced to help the community.
> [Jeremy R DeYoung](mailto:jeremy@blackfisk.com) initial built the foundation
> [Daniel Berg](mailto:daniel@blackfisk.com) is currently primary contributor to this project

## License

> All code provided within is licensed with a [GNU GPLv3 License](https://www.gnu.org/licenses/quick-guide-gplv3.en.html)
