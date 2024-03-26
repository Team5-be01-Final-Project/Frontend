<template>
    <div class="stock-list">
      <div class="va-table-responsive">
        <h3 class="va-h3">재고 조회</h3>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <VaSelect
            v-model="selectedField"
            placeholder="필터링할 필드 선택"
            :options="filterOptions"
            value-by="value"
          />
          <VaInput
            v-model="filter"
            placeholder="검색..."
            class="w-full"
          />
        </div>
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th class="text-center">품목기준코드</th>
              <th class="text-center">제품명</th>
              <th class="text-center">재고</th>
              <th class="text-center">단가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in paginatedStockList" :key="stock.proCode">
              <td class="text-center">{{ stock.proCode }}</td>
              <td>{{ stock.proName }}</td>
              <td class="text-center">{{ stock.stoAmo }}</td>
              <td class="text-right">{{ formatPrice(stock.proUnit) }}원</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
          <VaButton disabled>{{ currentPage }}</VaButton>
          <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { VaSelect, VaInput, VaButton } from 'vuestic-ui';
  
  const stockList = ref([]);
  const selectedField = ref(null);
  const filter = ref('');
  const currentPage = ref(1);
  const perPage = ref(15);
  
  const filterOptions = ref([
    { text: '품목코드', value: 'proCode' },
    { text: '제품명', value: 'proName' }
  ]);
  
  const filteredStockList = computed(() => {
    if (!filter.value || !selectedField.value) {
      return stockList.value;
    }
    return stockList.value.filter(stock =>
      String(stock[selectedField.value]).toLowerCase().includes(filter.value.toLowerCase())
    );
  });
  
  const paginatedStockList = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredStockList.value.slice(start, start + perPage.value);
  });
  
  const pageCount = computed(() => {
    return Math.ceil(filteredStockList.value.length / perPage.value);
  });
  
  function fetchStockList() {
    axios.get('/api/stocks/all')
      .then(response => {
        stockList.value = response.data;
      })
      .catch(error => {
        console.error('재고 목록을 가져오는 데 실패했습니다:', error);
      });
  }
  
  function nextPage() {
    if (currentPage.value < pageCount.value) {
      currentPage.value++;
    }
  }
  
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
  
  function formatPrice(price) {
    return typeof price === 'number' ? price.toLocaleString() : price;
  }
  
  onMounted(() => {
    fetchStockList();
  });
  </script>
  
  <style>
  .va-table-responsive {
    overflow: auto;
    min-height: 2000px; /* 최소 높이를 400px로 설정 */
  }
  
  .va-table {
    width: 800px; /* 테이블의 가로 너비를 800px로 설정 */
    table-layout: fixed; /* 테이블 레이아웃을 고정 */
    overflow-y: auto; /* 세로 스크롤 표시 */
  }
  
  /* 필터링 필드 선택과 검색 입력 간격 조절 */
  .va-table-responsive .va-input {
    margin-left: 10px;
  }
  
  .va-table th {
    font-size: 16px; /* 원하는 글꼴 크기로 조정 */
    text-align: center; /* 헤더 셀 가운데 정렬 */
  }
  
  .va-table td.text-center {
    text-align: center; /* 데이터 셀 가운데 정렬 */
  }
  
  .va-table td.text-right {
    text-align: right; /* 데이터 셀 오른쪽 정렬 */
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pagination button {
    margin: 0 5px;
  }
  </style>
  