<template>
    <va-button @click="exportToExcel">엑셀로 내보내기</va-button>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import { saveAs } from 'file-saver';
  
  export default {
    props: {
      data: Array,
      headers: Object,
      fileName: {
        type: String,
        default: 'Export.xlsx'
      }
    },
    methods: {
      exportToExcel() {
        const formattedData = this.data.map(item => {
          const formattedItem = {};
          for (const key in this.headers) {
            formattedItem[this.headers[key]] = item[key] || '-';
          }
          return formattedItem;
        });
  
        const ws = XLSX.utils.json_to_sheet(formattedData, { header: Object.values(this.headers) });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), this.fileName);
      }
    }
  }
  </script>
  