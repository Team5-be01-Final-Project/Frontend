<template>
  <va-button @click="exportToExcel">엑셀로 내보내기</va-button>
</template>

<script>
import ExcelJS from 'exceljs';
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
    async exportToExcel() {
      const workbook = new ExcelJS.Workbook(); // 워크북 생성
      const worksheet = workbook.addWorksheet('Sheet1'); // 워크시트 추가

      // 헤더 준비
      const headerValues = Object.values(this.headers);

      // 헤더 셀에 스타일 적용
      const headerRow = worksheet.addRow(headerValues);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DEE5F2' }, // 회색
          bgColor: { argb: 'DEE5F2' } // 파란색
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 14
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // 데이터 추가 및 최대 너비 계산
      const columnWidths = Array(headerValues.length).fill(0);
      this.data.forEach(item => {
        const row = [];
        headerValues.forEach((header, index) => {
          const value = item[Object.keys(this.headers)[index]] || '-';
          row.push(value);
          const valueLength = value.toString().length;
          if (valueLength > columnWidths[index]) {
            columnWidths[index] = valueLength;
          }
        });
        worksheet.addRow(row);
      });

      // 열 너비 설정
      worksheet.columns.forEach((column, i) => {
        column.width = columnWidths[i] < 10 ? 10 : columnWidths[i] + 2; // 최소 너비를 10으로 설정
      });

      // 파일 저장
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), this.fileName);
    }
  }
}
</script>
