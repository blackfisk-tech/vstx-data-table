export default {
  basic: {
    vue: `
      <template>
        <div class="container">
          <data-table :payload='data' >
        </div>
      </template>

      <script>
        import DataTable from 'vstx-data-table'

        export default {
          name: 'data-table-example',
          components: {
            'data-table': DataTable
          },
          data () {
           return {
              data: []
            }
          }
        }
      </script>
    `
  }
}
