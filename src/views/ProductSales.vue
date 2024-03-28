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
            <td>{{ item.proName || '-' }}</td>
            <td>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucAmount || '-' }}</td>
            <td>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
            <td>{{ item.profitMargin || '-' }}</td>
          </tr>
                  <!-- 총합계 행 -->
            <tr>
            <td colspan="3" class="text-center"><strong>총합계</strong></td>
            <td>{{ totalCostOfSales.toLocaleString() }}</td>
            <td>{{ totalVoucSales.toLocaleString() }}</td>
            <td>{{ totalGrossProfit.toLocaleString() }}</td>
            <td>-</td>
            </tr>
        </tbody>
      </table>
    </va-container>
  </template>
  
  <script setup>
  import { onMounted, ref, computed } from 'vue';
  import axios from 'axios';
  
  // Composition API를 사용하여 반응형 데이터 정의
  const salesData = ref([]);
  const fields = ref([
    { key: 'proName', label: '상품명', class: 'text-center' },
    { key: 'proUnit', label: '단가', class: 'text-center' },
    { key: 'voucAmount', label: '수량', class: 'text-center' },
    { key: 'costOfSales', label: '판매원가', class: 'text-center' },
    { key: 'voucSales', label: '매출액', class: 'text-center' },
    { key: 'grossProfit', label: '매출이익', class: 'text-center' },
    { key: 'profitMargin', label: '이익율', class: 'text-center' },
  ]);
  
  // 데이터 가져오기 로직
  const fetchSalesData = () => {
    axios.get('/sales/productsales')
      .then(response => {
        salesData.value = response.data.map(item => ({
          ...item,
          profitMargin: item.profitMargin ? `${Math.round(item.profitMargin)}%` : '-', // 조건부 포맷 변경
        }));
      })
      .catch(error => {
        console.error("There was an error fetching the sales data:", error);
      });
  };
  
  // 컴포넌트가 마운트될 때 데이터 가져오기
  onMounted(fetchSalesData);
  // 총합계 계산
const totalCostOfSales = computed(() => salesData.value.reduce((acc, item) => acc + (item.costOfSales || 0), 0));
const totalVoucSales = computed(() => salesData.value.reduce((acc, item) => acc + (item.voucSales || 0), 0));
const totalGrossProfit = computed(() => salesData.value.reduce((acc, item) => acc + (item.grossProfit || 0), 0));
  </script>
  