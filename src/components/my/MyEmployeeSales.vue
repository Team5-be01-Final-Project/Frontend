<!-- MyEmployeeSales.vue -->
<template>
  <div class="employee-sales">
    <h3>내 매출 현황</h3>
    <div class="sales-table">
      <table>
        <thead>
          <tr>
            <th>거래처명</th>
            <th v-for="(month, index) in recentMonths" :key="index">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in employeeSales" :key="index">
            <td>{{ sale.clientName }}</td>
            <td v-for="(monthlySale, index) in sale.monthlySales" :key="index">
              {{ formatCurrency(monthlySale) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const employeeSales = ref([]);
const recentMonths = ref([]);

onMounted(async () => {
  const empCode = Cookies.get('empCode');
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const response = await axios.get('/sales/employeeSales', {
      params: {
        empCode: empCode,
        year: year,
        month: month,
      },
    });

    employeeSales.value = response.data;

    // 최근 3개월 설정 (오름차순)
    recentMonths.value = [];
    for (let i = 2; i >= 0; i--) {
      const targetMonth = new Date(year, month - 1 - i);
      const monthName = targetMonth.toLocaleString('default', { month: 'long' });
      recentMonths.value.push(monthName);
    }
  } catch (error) {
    console.error('내 매출 현황을 가져오는데 실패했습니다.', error);
  }
});

// 통화 형식으로 변환하는 함수
function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}
</script>

<style scoped>
.employee-sales {
  margin-top: 20px;
}

.sales-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}
</style>