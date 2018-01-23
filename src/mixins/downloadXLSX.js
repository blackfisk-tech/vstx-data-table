import XLSX from 'xlsx'
export const downloadXLSX = {
  methods: {
    downloadXLSX (input = [], filename = `export-xlsx-${new Date().toISOString().split('T')[0]}.xlsx`) {
      const worksheet = XLSX.utils.json_to_sheet(input)
      let workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet')
      const fileOptions = {bookType: 'xlsx', bookSST: false, type: 'array'}
      const file = XLSX.write(workbook, fileOptions)
      const blob = new Blob([file], {type: 'xlsx'})
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
    }
  }
}
