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
      headerRow.eachCell((cell) => {
        this.applyCellStyles(cell, 'header');
      });
 
      // 데이터 추가 및 최대 너비 계산
      const maxWidths = headerValues.map(() => 0);
      this.data.forEach(item => {
        const row = [];
        Object.keys(this.headers).forEach((key, index) => {
          const value = item[key] || '-';
          row.push(value);
          maxWidths[index] = Math.max(maxWidths[index], String(value).length);
        });
        const dataRow = worksheet.addRow(row);
        dataRow.eachCell((cell) => {
          this.applyCellStyles(cell, 'data');
        });
      });
 
      // 열 너비 설정
      worksheet.columns.forEach((column, i) => {
        column.width = maxWidths[i] < 10 ? 10 : maxWidths[i] + 5;
      });
 
      // 전체 범위에 굵은 테두리 적용
      this.applyThickBorderToWholeRange(worksheet, 1, worksheet.rowCount, 1, worksheet.columns.length);
 
      // 파일 저장
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), this.fileName);
    },
    applyCellStyles(cell, type) {
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
 
      if (type === 'header') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DEE5F2' },
          bgColor: { argb: 'DEE5F2' }
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 14
        };
      }
    },
    applyThickBorderToWholeRange(worksheet, startRow, endRow, startColumn, endColumn) {
      // 굵은 테두리를 전체 범위의 외곽에 적용
      for (let row = startRow; row <= endRow; row++) {
        worksheet.getRow(row).getCell(startColumn).border.left = {
          style: 'thick',
          color: { argb: '000000' }
        };
        worksheet.getRow(row).getCell(endColumn).border.right = {
          style: 'thick',
          color: { argb: '000000' }
        };
      }
 
      for (let col = startColumn; col <= endColumn; col++) {
        worksheet.getRow(startRow).getCell(col).border.top = {
          style: 'thick',
          color: { argb: '000000' }
        };
        worksheet.getRow(endRow).getCell(col).border.bottom = {
          style: 'thick',
          color: { argb: '000000' }
        };
      }
    }
  }
 }
 </script>