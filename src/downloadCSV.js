import { forEach } from 'lodash'
export const downloadCSV = {
  methods: {
    downloadCSV (input = [], filename = `export-${new Date().toISOString().split('T')[0]}.csv`, columnDelimiter = ',', lineDelimiter = '\n') {
      if (!input.length) return
      input = this.convertCSV(input, columnDelimiter, lineDelimiter)
      if (!input.match(/^data:text\/csv/i)) {
        input = 'data:text/csv;charset=utf-8,' + input
      }
      let output = encodeURI(input)
      let link = document.createElement('a')
      link.setAttribute('href', output)
      link.setAttribute('download', filename)
      link.click()
    },
    convertCSV (input = [], columnDelimiter = ',', lineDelimiter = '\n') {
      let data = input
      if (data == null || !data.length) {
        return
      }
      let keys = Object.keys(data[0])
      //
      let result = ''
      result += keys.join(columnDelimiter)
      result += lineDelimiter
      //
      forEach(data, (item) => {
        let ctr = 0
        forEach(keys, (key) => {
          if (ctr > 0) result += columnDelimiter
          let data = item[key]
          if (typeof data === 'string') {
            // data.match(/\r?\n|\r|\f/g)
            // Include feed?
            if (data.includes(',') || data.includes('"') || (data.match(/\r?\n|\r/g) !== null && data.match(/\r?\n|\r/g).length > 0)) {
              if (data.includes('"')) {
                data = data.replace(/"/g, '""')
              }
              data = `"${data}"`
            }
            data = data.trim()
          }
          result += data
          ctr++
        })
        result += lineDelimiter
      })

      return result
    }
  }
}
