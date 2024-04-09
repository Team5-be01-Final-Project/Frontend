<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SalesSidebar />
    </div>

    <div class="Main">
      <va-container>
        <h3 class="va-h3">거래처별 매출 현황</h3>

        <div>
          <va-select v-model="selectedYear" :options="yearOption" placeholder="년도 선택" />
          <va-select v-model="selectedMonth" :options="monthOptions1" placeholder="월 선택" />
          <va-input v-model="clientNameFilter" placeholder="거래처명 검색" />
          <va-button @click="filterSalesData">검색</va-button>
        </div>
        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <th>No.</th>
              <th v-for="field in fields" :key="field.key" class="text-center">
                {{ field.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in displayedSalesData" :key="item.clientName + item.proName">
              <td class = 'index-center'>{{ index + 1 }}</td>
              <td>{{ item.clientName }}</td>
              <td>{{ item.proName || '-' }}</td>
              <td class = 'money-right'>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
              <td class = 'money-right'>{{ item.voucSale ? `${item.voucSale.toLocaleString()}` : '-' }}</td>
              <td class = 'money-right'>{{ item.voucAmount || '-' }}</td>
              <td class = 'money-right'>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
              <td class = 'money-right'>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
              <td class = 'money-right'>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
              <td class = 'money-right'>{{ formatProfitMargin(item.profitMargin) }}</td>
            </tr>
          </tbody>
        </table>
      </va-container>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { yearOptions } from '@/utils/yearOptions.js'; 
import { monthOptions1 } from '@/utils/monthOptions';
import SalesSidebar from '@/components/sidebar/SalesSidebar.vue'

const defaultYearOption = yearOptions.find(option => option.value === new Date().getFullYear());
const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2); // 현재 월을 두 자리 문자열로 포맷팅

const yearOption = yearOptions;
const selectedYear = ref(defaultYearOption); // 현재 년도를 기본값으로 설정
const selectedMonth = ref(monthOptions1.find(option => option.value === currentMonth));
const clientNameFilter = ref('');

const filteredSalesData = ref([]);
const displayedSalesData = ref(filteredSalesData); // 바로 filteredSalesData를 참조하도록 변경

const fields = [
  { key: 'clientName', label: '거래처', class: 'text-center' },
  { key: 'proName', label: '상품명', class: 'text-center' },
  { key: 'proUnit', label: '단가', class: 'text-center' },
  { key: 'voucSale', label: '판매가', class: 'text-center' },
  { key: 'voucAmount', label: '수량', class: 'text-center' },
  { key: 'costOfSales', label: '판매원가', class: 'text-center' },
  { key: 'voucSales', label: '매출액', class: 'text-center' },
  { key: 'grossProfit', label: '매출이익', class: 'text-center' },
  { key: 'profitMargin', label: '이익율', class: 'text-center' },
];

const fetchSalesData = async (year = defaultYearOption.value, month = currentMonth) => {
  let url = '/sales/Clientsales';
  let params = {};

  if (year !== null) {
    params.year = year;
  }

  if (month !== null) {
    params.month = month;
  }

  try {
    const response = await axios.get(url, { params });
    filteredSalesData.value = filterByClientName(response.data, clientNameFilter.value);
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};

const formatProfitMargin = (profitMargin) => {
  if (profitMargin === null || profitMargin === undefined) {
    return '-';
  } else {
    return (Math.round(profitMargin * 10) / 10).toFixed(1) + '%';
  }
};

const filterSalesData = () => {
  const year = selectedYear.value.value;
  const month = selectedMonth.value ? (typeof selectedMonth.value === 'object' ? selectedMonth.value.value : selectedMonth.value) : null;
  fetchSalesData(year, month);
};

onMounted(() => {
  fetchSalesData();
});

const filterByClientName = (data, clientName) => {
  if (!clientName) {
    return data;
  }
  return data.filter(item => item.clientName.toLowerCase().includes(clientName.toLowerCase()));
};
</script>

<style scoped>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바의 너비를 조절하세요 */
  /* 필요에 따라 추가 스타일링 */
}

.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}
</style>