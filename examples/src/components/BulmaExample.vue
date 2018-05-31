<template lang="pug">
  .wrapper(id="app")
    section.section
      .container
        vstx-data-table(
          :payload="state.payload",
          :columns="settings.dataTable.columns"
          :configuration="settings.dataTable.configuration"
        )
          //- Insert a Data Table Title
          template(slot="slot-title")
            h1.title Asynchronous Data Table Example
          //- Override Cell Content
          template(slot="name", slot-scope="data") {{ data.item.name.last }}, {{ data.item.name.first }}

</template>

<script>
import Vue from 'vue'
import Axios from 'axios'
import VstxDataTable from '../../../dist/vstx-data-table.min.esm.js'

Vue.use(VstxDataTable)

import 'bulma'

export default {
  name: 'BulmaExample',
  data () {
    return {
      state: {
        payload: []
      },
      settings: {
        dataTable: {
          isLoading: false,
          columns: [
            {
              name: 'ID',
              align: 'left',
              field: '_id',
              format: 'formatString',
              position: 0,
              isVisible: false,
              sort: {}
            },
            {
              name: 'Index',
              field: 'index',
              isVisible: false,
              sort: {}
            },
            {
              name: 'Is Active',
              field: 'isActive',
              isVisible: false,
              sort: {}
            },
            {
              name: 'GUID',
              field: 'guid',
              isVisible: false,
              sort: {}
            },
            {
              name: 'Name',
              field: 'name',
              isVisible: true,
              sort: {}
            },
            {
              name: 'Address',
              field: 'address',
              isVisible: true,
              sort: {}
            },
            {
              name: 'Phone',
              field: 'phone',
              isVisible: true,
              sort: {}
            },
            {
              name: 'Balance',
              field: 'balance',
              format: 'formatMoney',
              isVisible: true,
              sort: {
                isSortable: true,
                direction: 'desc',
                order: 0
              }
            }
          ],
          configuration: {
            size: 'normal',
            allowWorkers: true,
            offsetTop: 0,
            table: {
              isLoading: true,
              fullwidth: true,
              isSelectable: true,
              hasFixedHeaders: true
            },
            filter: {
              isVisible: true
            },
            pagination: {
              rowsPerPage: 25
            },
            totals: {
              isVisible: {
                count: false
              }
            }
          }
        }
      }
    }
  },
  mounted () {
    Axios({
      url: 'https://next.json-generator.com/api/json/get/4Jq4KGZJr',
      method: 'get'
    }).then(response => {
      this.state.payload = response.data
    }).catch()
  }
}
</script>

<style>
</style>
