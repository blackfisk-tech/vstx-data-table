import Vue from 'vue'
import App from './App.vue'
/*
  Due to the how we built this component, you will have to call
  all icons. This step is NOT necessary if you use font-awesome
  library in your application already.
 */
import fontawesome from '@fortawesome/fontawesome'
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

fontawesome.library.add(faSearch)
fontawesome.library.add(faTable)
fontawesome.library.add(faColumns)
fontawesome.library.add(faSort)
fontawesome.library.add(faFileExcel)
fontawesome.library.add(faTimes)
fontawesome.library.add(faList)
fontawesome.library.add(faWrench)
fontawesome.library.add(faAngleLeft)
fontawesome.library.add(faAngleRight)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
