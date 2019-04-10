import vstxDataTable from '../dist/vstx-data-table'
import VueWorker from 'vue-worker'
import AsyncComputed from 'vue-async-computed'

module.exports = {
  install: function (Vue, options) {
    Vue.use(VueWorker)
    Vue.use(AsyncComputed)
    Vue.prototype.$vstxDataTable = {
      options
    }
    Vue.component('vstx-data-table', vstxDataTable)
  }
}
