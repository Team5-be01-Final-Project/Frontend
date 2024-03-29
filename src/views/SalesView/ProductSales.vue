<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SalesSidebar />
    </div>

    <va-container>
      <h3 class="va-h3">상품별 매출 현황</h3>
      <div>
        <va-select v-model="selectedYear" :options="yearOptions" placeholder="년도 선택" />
        <va-select v-model="selectedMonth" :options="monthOptions1" placeholder="월 선택" />
        <va-input v-model="proNameFilter" placeholder="상품명 검색" />
        <va-button @click="filterSalesData">조회</va-button>
      </div>
      <table class="va-table va-table--hoverable">
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
          <tr v-for="(item, index) in displayedSalesData" :key="item.proName">
            <td>{{ index + 1 }}</td>
            <td>{{ item.proName || '-' }}</td>
            <td>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucAmount || '-' }}</td>
            <td>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
            <td>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
            <td>{{ formatProfitMargin(item.profitMargin) }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-center"><strong>총합계</strong></td>
            <td>{{ totalCostOfSales.toLocaleString() }}</td>
            <td>{{ totalVoucSales.toLocaleString() }}</td>
            <td>{{ totalGrossProfit.toLocaleString() }}</td>
            <td>{{ formatProfitMargin(totalprofitMargin) }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <va-button @click="prevPage" :disabled="currentPage === 1">이전</va-button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <va-button @click="nextPage" :disabled="currentPage === totalPages">다음</va-button>
      </div>
    </va-container>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { monthOptions1 } from '@/utils/monthOptions';
import SalesSidebar from '@/components/sidebar/SalesSidebar.vue'

const currentYear = new Date().getFullYear().toString();
const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2); // 현재 월을 두 자리 문자열로 포맷팅

const yearOptions = Array.from({ length: 5 }, (_, i) => ({
  text: `${2020 + i}년`, value: `${2020 + i}`
}));
const selectedYear = ref(currentYear); // 현재 년도를 기본값으로 설정
// monthOptions1에서 현재 월에 해당하는 객체를 찾아 기본값으로 설정
const selectedMonth = ref(monthOptions1.find(option => option.value === currentMonth));

const currentPage = ref(1);
const totalPages = ref(0);
const pageSize = 20;
const filteredSalesData = ref([]);
const displayedSalesData = ref([]);
const proNameFilter = ref('');
const fields = [
  { key: 'proName', label: '상품명', class: 'text-center' },
  { key: 'proUnit', label: '단가', class: 'text-center' },
  { key: 'voucAmount', label: '수량', class: 'text-center' },
  { key: 'costOfSales', label: '판매원가', class: 'text-center' },
  { key: 'voucSales', label: '매출액', class: 'text-center' },
  { key: 'grossProfit', label: '매출이익', class: 'text-center' },
  { key: 'profitMargin', label: '이익율', class: 'text-center' },
];

// 정렬 상태
const sortKey = ref('');
const sortOrder = ref('');

// 데이터 정렬 함수
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

  // 현재 페이지 데이터를 다시 계산
  updateDisplayedSalesData();
};

// 데이터 가져오기 로직
const fetchSalesData = async (year = currentYear, month = currentMonth) => {
  let url = '/sales/productsales';
  let params = {};

  if (year !== null) {
    params.year = year;
  }

  if (month !== null) {
    params.month = month;
  }

  try {
    const response = await axios.get(url, { params });
    filteredSalesData.value = filterByProName(response.data, proNameFilter.value); // 상품명 필터링 추가
    totalPages.value = Math.ceil(filteredSalesData.value.length / pageSize);
    currentPage.value = 1; // 데이터 로드 시 항상 첫 페이지로 초기화
    updateDisplayedSalesData();
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};

// 이익율을 반올림하여 소수점 둘째 자리까지 표시하고 '%'를 붙여주는 함수
const formatProfitMargin = (profitMargin) => {
  if (profitMargin === null || profitMargin === undefined) {
    return '-';
  } else {
    return (Math.round(profitMargin * 10) / 10).toFixed(1) + '%';
  }
};

// 현재 페이지에 따라 데이터를 표시
const updateDisplayedSalesData = () => {
  const start = (currentPage.value - 1) * pageSize;
  displayedSalesData.value = filteredSalesData.value.slice(start, start + pageSize);
};

// 이전 페이지로 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateDisplayedSalesData();
  }
};

// 다음 페이지로 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateDisplayedSalesData();
  }
};

// 조회 버튼 클릭 시 데이터 필터링
const filterSalesData = () => {
  const year = selectedYear.value ? parseInt(selectedYear.value) : null;
  const month = selectedMonth.value ? (typeof selectedMonth.value === 'object' ? parseInt(selectedMonth.value.value) : parseInt(selectedMonth.value)) : null;
  fetchSalesData(year, month);
};

// 초기 데이터 로드 (전체 데이터)
onMounted(() => {
  fetchSalesData();
});

// 판매상품을 필터링하는 함수
const filterByProName = (data, proName) => {
  if (!proName) {
    return data;
  }
  return data.filter(item => item.proName.toLowerCase().includes(proName.toLowerCase()));
};

const totalCostOfSales = computed(() => {
  return filteredSalesData.value.reduce((acc, item) => acc + (item.costOfSales || 0), 0);
});
const totalVoucSales = computed(() => {
  return filteredSalesData.value.reduce((acc, item) => acc + (item.voucSales || 0), 0);
});
const totalGrossProfit = computed(() => {
  return filteredSalesData.value.reduce((acc, item) => acc + (item.grossProfit || 0), 0);
});
const totalprofitMargin = computed(() => {
  if (totalVoucSales.value === 0) {
    return 0; // 분모가 0일 때는 이익율을 0으로 설정
  }
  return (totalGrossProfit.value / totalVoucSales.value) * 100;
});
</script>