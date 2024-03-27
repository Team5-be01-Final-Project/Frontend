<template>
    <va-container>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <!-- 테이블 헤더 -->
            <th v-for="field in fields" :key="field.key" class="text-center">
              {{ field.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 데이터 행 -->
          <tr v-for="item in salesData" :key="item.clientName + item.proName">
            <td>{{ item.clientName }}</td>
            <td>{{ item.proName || '-' }}</td>
            <td>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucSale ? `${item.voucSale.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucAmount || '-' }}</td>
            <td>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
            <td>{{ item.profitMargin || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </va-container>
  </template>
  
  <script >
  import axios from 'axios';
  
  export default {
    data() {
      return {
        salesData: [],
        fields: [
          { key: 'clientName', label: '거래처', class: 'text-center' },
          { key: 'proName', label: '상품명', class: 'text-center' },
          { key: 'proUnit', label: '단가', class: 'text-center' },
          { key: 'voucSale', label: '판매가', class: 'text-center' },
          { key: 'voucAmount', label: '수량', class: 'text-center' },
          { key: 'costOfSales', label: '판매원가', class: 'text-center' },
          { key: 'voucSales', label: '매출액', class: 'text-center' },
          { key: 'grossProfit', label: '매출이익', class: 'text-center' },
          { key: 'profitMargin', label: '이익율', class: 'text-center' },
        ],
      };
    },
    methods: {
      fetchSalesData() {
        axios.get('/Clientsales')
          .then(response => {
            this.salesData = response.data.map(item => ({
              ...item,
              profitMargin: item.profitMargin ? `${Math.round(item.profitMargin)}%` : '-', // 조건부 포맷 변경
            }));
          })
          .catch(error => {
            console.error("There was an error fetching the sales data:", error);
          });
      },
    },
    mounted() {
      this.fetchSalesData();
    },
  };
  </script>