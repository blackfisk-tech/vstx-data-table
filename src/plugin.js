import vstxDataTable from './vstxDataTable.vue'
import VueWorker from 'vue-worker'
import AsyncComputed from 'vue-async-computed'

module.exports = {
  install: function (Vue, options) {
    Vue.use(VueWorker)
    Vue.use(AsyncComputed)
    Vue.component('vstx-data-table', vstxDataTable)
  }
}
