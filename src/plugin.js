import vstxDataTable from './vstxDataTable.vue'
import VueWorker from 'vue-worker'
import AsyncComputed from 'vue-async-computed'
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

module.exports = {
  install: function (Vue, options) {
    Vue.use(VueWorker)
    Vue.use(AsyncComputed)
    Vue.component('vstx-data-table', vstxDataTable)
  }
}
