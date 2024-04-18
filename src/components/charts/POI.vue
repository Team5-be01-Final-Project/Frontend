<template>
  <h4>거래처별 매출 현황</h4>
  <div>
    <div class="right-align">단위 : 원</div>
    <table class="va-table va-table--hoverable">
      <thead>
        <tr>
          <th>순위</th>
          <th>거래처명</th>
          <th>매출액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in rankedSalesTotals" :key="entry.clientName">
          <td class="index-center">{{ index + 1 }}</td>
          <td>{{ entry.clientName }}</td>
          <td class='money-right'>{{ formatCurrency(entry.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const rankedSalesTotals = ref([]);

onMounted(async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // getMonth()는 0부터 시작하므로 1을 더해줍니다. 월을 2자리로 포맷팅합니다.
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

  try {
    const response = await axios.get(`/sales/Clientsales?year=${currentYear}&month=${currentMonth}`);
    const salesData = response.data; // 서버로부터 받은 거래처별 매출 데이터

    const totals = {};
    salesData.forEach(item => {
      if (!totals[item.clientName]) {
        totals[item.clientName] = 0;
      }
      totals[item.clientName] += item.voucSales;
    });

    rankedSalesTotals.value = Object.entries(totals)
      .map(([clientName, total]) => ({ clientName, total }))
      .sort((a, b) => b.total - a.total);
  } catch (error) {
    console.error('매출 데이터를 가져오는데 실패했습니다:', error);
  }
});

// 매출 총합을 통화 형식으로 포매팅하는 함수
const formatCurrency = (value) => {
  return `${Number(value).toLocaleString()}`;
};
</script>

<style>
.va-table {
  width: 700px;
  border-collapse: collapse;
  margin-top: 20px;
}

.va-table th,
.va-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left; 
}

.va-table--hoverable tbody tr:hover {
  background-color: #f5f5f5;
}

h4 {
  font-size: 25px;
  /* h4 태그의 폰트 사이즈를 키움 */
}

.va-table thead th {
  background-color: #f5f5f5; /* 짙은 파란색 배경 */
  font-weight: bold; /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc; /* 회색 테두리 */
  font-size: 15px;
}
</style>