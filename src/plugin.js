import vstxDataTable from './vstxDataTable.vue'
import VueWorker from 'vue-worker'
import AsyncComputed from 'vue-async-computed'

const VstxDataTable = {
  install (Vue, options) {
    Vue.use(VueWorker)
    Vue.use(AsyncComputed)
    Vue.component('vstx-data-table', vstxDataTable)
  }
}

export default VstxDataTable

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VstxDataTable)
}
