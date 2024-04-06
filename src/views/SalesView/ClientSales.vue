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
          <va-select v-model="selectedYear" :options="yearOptions" placeholder="년도 선택" />
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
              <td>{{ index + 1 }}</td>
              <td>{{ item.clientName }}</td>
              <td>{{ item.proName || '-' }}</td>
              <td>{{ item.proUnit ? `${item.proUnit.toLocaleString()}` : '-' }}</td>
              <td>{{ item.voucSale ? `${item.voucSale.toLocaleString()}` : '-' }}</td>
              <td>{{ item.voucAmount || '-' }}</td>
              <td>{{ item.costOfSales ? `${item.costOfSales.toLocaleString()}` : '-' }}</td>
              <td>{{ item.voucSales ? `${item.voucSales.toLocaleString()}` : '-' }}</td>
              <td>{{ item.grossProfit ? `${item.grossProfit.toLocaleString()}` : '-' }}</td>
              <td>{{ formatProfitMargin(item.profitMargin) }}</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
const clientNameFilter = ref('');

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

// 데이터 가져오기
const fetchSalesData = async (year = currentYear, month = currentMonth) => {
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
    filteredSalesData.value = filterByClientName(response.data, clientNameFilter.value); // 거래처 필터링 추가
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

// 거래처를 필터링하는 함수
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