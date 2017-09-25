import DataTable from './DataTable.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('data-table', DataTable);
  }
};