<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SalesSidebar />
    </div>
    <div class="Main">
      <va-container>
        <h3 class="va-h3">상품별 매출 현황</h3>
        <div>
          <va-select v-model="selectedYear" :options="yearOptions" placeholder="년도 선택" />
          <va-select v-model="selectedMonth" :options="monthOptions1" placeholder="월 선택" />
          <va-input v-model="proNameFilter" placeholder="상품명 검색" />
          <va-button @click="filterSalesData">검색</va-button>
        </div>
        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <!-- 테이블 헤더 -->
              <th>No.</th>
              <th v-for="field in fields" :key="field.key" class="text-center" @click="sortData(field.key)">
                {{ field.label }}
                <span>{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- 데이터 행 -->
            <tr class="total-sum">
              <td colspan="4" class="index-center"><strong>총합계</strong></td>
              <td class = 'money-right'>{{ totalCostOfSales.toLocaleString() }}</td>
              <td class = 'money-right'>{{ totalVoucSales.toLocaleString() }}</td>
              <td class = 'money-right'>{{ totalGrossProfit.toLocaleString() }}</td>
              <td class = 'money-right'>{{ formatProfitMargin(totalprofitMargin) }}</td>
            </tr>
            <tr v-for="(item, index) in displayedSalesData" :key="item.proName">
              <td class="index-center">{{ index + 1 }}</td>
              <td>{{ item.proName || '-' }}</td>
              <td class = 'money-right'>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
              <td class="index-center">{{ item.voucAmount || '-' }}</td>
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
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { yearOptions } from '@/utils/yearOptions.js'; 
import { monthOptions1 } from '@/utils/monthOptions';
import SalesSidebar from '@/components/sidebar/SalesSidebar.vue';

const defaultYearOption = yearOptions.find(option => option.value === new Date().getFullYear());
const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2); // 현재 월을 두 자리 문자열로 포맷팅

const yearOption = yearOptions;
const selectedYear = ref(defaultYearOption); // 현재 년도를 기본값으로 설정
const selectedMonth = ref(monthOptions1.find(option => option.value === currentMonth));
const proNameFilter = ref('');

const filteredSalesData = ref([]);
const displayedSalesData = filteredSalesData; // filteredSalesData를 직접 참조하도록 변경
const fields = [
  { key: 'proName', label: '상품명', class: 'text-center' },
  { key: 'proUnit', label: '단가', class: 'text-center' },
  { key: 'voucAmount', label: '수량', class: 'text-center' },
  { key: 'costOfSales', label: '판매원가', class: 'text-center' },
  { key: 'voucSales', label: '매출액', class: 'text-center' },
  { key: 'grossProfit', label: '매출이익', class: 'text-center' },
  { key: 'profitMargin', label: '이익율', class: 'text-center' },
];

const sortKey = ref('');
const sortOrder = ref('');

const sortData = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  filteredSalesData.value.sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a[sortKey.value] > b[sortKey.value] ? 1 : -1;
    } else {
      return a[sortKey.value] < b[sortKey.value] ? 1 : -1;
    }
  });
};

const fetchSalesData = async (year = defaultYearOption.value, month = currentMonth) => {
  let url = '/sales/productsales';
  let params = { year, month };

  try {
    const response = await axios.get(url, { params });
    filteredSalesData.value = filterByProName(response.data, proNameFilter.value);
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};

const formatProfitMargin = (profitMargin) => {
  if (profitMargin === null || profitMargin === undefined) {
    return '-';
  } else {
    return (Math.round(profitMargin * 100) / 100).toFixed(1) + '%';
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

const filterByProName = (data, proName) => {
  if (!proName) return data;
  return data.filter(item => item.proName.toLowerCase().includes(proName.toLowerCase()));
};

// 총합계 계산을 위한 computed 속성
const totalCostOfSales = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.costOfSales || 0), 0));
const totalVoucSales = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.voucSales || 0), 0));
const totalGrossProfit = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.grossProfit || 0), 0));
const totalprofitMargin = computed(() => totalVoucSales.value ? (totalGrossProfit.value / totalVoucSales.value) * 100 : 0);
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

.va-table thead, .va-table tfoot, .va-table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed; /* 테이블 셀의 너비를 고정 */
}

.total-sum {
  background-color: #f0f0f0; /* 총합계 행에 색상 적용 */
}
</style>