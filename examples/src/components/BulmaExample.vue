<template lang="pug">
  .wrapper(id="app")
    .columns
      .column
        DataTable(
          :payload="state.payload",
          :columns="settings.dataTable.columns"
          :configuration="settings.dataTable.configuration"
        )
          template(slot="name", slot-scope="data") {{ data.item.name.first }}, {{ data.item.name.first }}
</template>

<script>
import Axios from 'axios'
import DataTable from 'vstx-data-table'
import 'bulma'

export default {
  name: 'BulmaExample',
  components: {
    DataTable
  },
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
              name: 'Id',
              align: 'left',
              field: '_id',
              format: 'formatString',
              position: 0,
              isVisible: false,
              sort: {}
            },
            {
              field: 'index',
              isVisible: false,
              sort: {}
            },
            {
              field: 'isActive',
              isVisible: false,
              sort: {}
            },
            {
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
              rowsPerPage: 5
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
