<!-- ProductSales.vue -->
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
          <va-select v-model="selectedYear" :options="yearOptions" placeholder="년도 선택" style="margin-right: 5px;" />
          <va-select v-model="selectedMonth" :options="monthOptions1" placeholder="월 선택" style="margin-right: 5px;" />
          <va-input v-model="proNameFilter" placeholder="상품명 검색" style="margin-right: 5px;" />
          <va-button @click="filterSalesData">검색</va-button>
        </div>
        <div class="right-align">단위: 원/개</div>
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
              <td class='money-right'>{{ totalCostOfSales.toLocaleString() }}</td>
              <td class='money-right'>{{ totalVoucSales.toLocaleString() }}</td>
              <td class='money-right'>{{ totalGrossProfit.toLocaleString() }}</td>
              <td class='money-right'>{{ formatProfitMargin(totalprofitMargin) }}</td>
            </tr>
            <tr v-for="(item, index) in displayedSalesData" :key="item.proName">
              <td class="index-center">{{ index + 1 }}</td>
              <td>{{ item.proName || '-' }}</td>
              <td class='money-right'>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
              <td class="index-center">{{ formatNumberWithCommas(item.voucAmount || '-') }}</td>
              <td class='money-right'>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
              <td class='money-right'>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
              <td class='money-right'>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
              <td class='money-right'>{{ formatProfitMargin(item.profitMargin) }}</td>
            </tr>
          </tbody>
        </table>
      </va-container>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
// Vue의 컴포지션 API에서 필요한 함수들을 가져옵니다.

import axios from 'axios';
// HTTP 요청을 보내기 위한 axios 라이브러리를 가져옵니다.

import { yearOptions } from '@/utils/yearOptions.js'; 
import { monthOptions1 } from '@/utils/monthOptions';
// 년도와 월 선택 옵션을 가져옵니다.

import SalesSidebar from '@/components/sidebar/SalesSidebar.vue';
// 사이드바 컴포넌트를 가져옵니다.

import formatNumberWithCommas from '@/utils/formatNumberWithCommas';

const defaultYearOption = yearOptions.find(option => option.value === new Date().getFullYear());
// 기본 년도 옵션을 현재 년도로 설정합니다.

const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2);
// 현재 월을 두 자리 문자열로 포맷팅합니다.

const yearOption = yearOptions;
// 년도 선택 옵션을 설정합니다.

const selectedYear = ref(defaultYearOption);
// 선택된 년도를 현재 년도로 초기화합니다.

const selectedMonth = ref(monthOptions1.find(option => option.value === currentMonth));
// 선택된 월을 현재 월로 초기화합니다.

const proNameFilter = ref('');
// 상품명 검색어를 저장할 ref를 생성합니다.

const filteredSalesData = ref([]);
// 필터링된 매출 데이터를 저장할 ref를 생성합니다.

const displayedSalesData = filteredSalesData;
// 표시할 매출 데이터를 필터링된 데이터로 설정합니다.

const fields = [
  { key: 'proName', label: '상품명', class: 'text-center' },
  { key: 'proUnit', label: '단가', class: 'text-center' },
  { key: 'voucAmount', label: '수량', class: 'text-center' },
  { key: 'costOfSales', label: '판매원가', class: 'text-center' },
  { key: 'voucSales', label: '매출액', class: 'text-center' },
  { key: 'grossProfit', label: '매출이익', class: 'text-center' },
  { key: 'profitMargin', label: '이익율', class: 'text-center' },
];
// 테이블 헤더에 표시할 필드 정보를 정의합니다.

const sortKey = ref('');
// 정렬 기준 키를 저장할 ref를 생성합니다.

const sortOrder = ref('');
// 정렬 순서를 저장할 ref를 생성합니다.

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
// 데이터를 정렬하는 함수입니다.
// 클릭한 필드의 키를 기준으로 오름차순 또는 내림차순으로 정렬합니다.

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
// 매출 데이터를 가져오는 함수입니다.
// 선택된 년도와 월을 기준으로 데이터를 가져옵니다.

const formatProfitMargin = (profitMargin) => {
  if (profitMargin === null || profitMargin === undefined) {
    return '-';
  } else {
    return (Math.round(profitMargin * 100) / 100).toFixed(1) + '%';
  }
};
// 이익율을 포맷팅하는 함수입니다.
// 소수점 둘째 자리까지 표시하고 '%' 기호를 붙입니다.

const filterSalesData = () => {
  const year = selectedYear.value.value;
  const month = selectedMonth.value ? (typeof selectedMonth.value === 'object' ? selectedMonth.value.value : selectedMonth.value) : null;
  fetchSalesData(year, month);
};
// 매출 데이터를 필터링하는 함수입니다.
// 선택된 년도와 월을 기준으로 데이터를 다시 가져옵니다.

onMounted(() => {
  fetchSalesData();
});
// 컴포넌트가 마운트될 때 초기 매출 데이터를 가져옵니다.

const filterByProName = (data, proName) => {
  if (!proName) return data;
  return data.filter(item => item.proName.toLowerCase().includes(proName.toLowerCase()));
};
// 상품명으로 데이터를 필터링하는 함수입니다.
// 입력된 검색어를 포함하는 상품만 필터링합니다.

const totalCostOfSales = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.costOfSales || 0), 0));
const totalVoucSales = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.voucSales || 0), 0));
const totalGrossProfit = computed(() => filteredSalesData.value.reduce((acc, item) => acc + (item.grossProfit || 0), 0));
const totalprofitMargin = computed(() => totalVoucSales.value ? (totalGrossProfit.value / totalVoucSales.value) * 100 : 0);
// 총합계를 계산하는 computed 속성들입니다.
// 필터링된 데이터를 기준으로 각 필드의 합계를 계산합니다.
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
  table-layout: fixed; 
  /* 테이블 셀의 너비를 고정 */
}

.total-sum {
  background-color: #f0f0f0; /* 총합계 행에 색상 적용 */
}
</style>