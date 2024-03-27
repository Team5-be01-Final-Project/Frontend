<!-- StockList.vue -->
<template>
   <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar/>
    </div>
    
  <div class="stock-list">
    <h3 class="va-h3">재고 조회</h3>
    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="filter-options-container">
        <div class="filter-options">
          <VaSelect
            v-model="selectedField"
            placeholder="필터링할 필드 선택"
            :options="filterOptions"
            value-by="value"
            class="w-full filter-options"
          />
          <VaInput v-model="filter" placeholder="검색..." class="w-full" />
        </div>
        <div class="register-button-container">
          <button @click="openRegisterModal" class="register-button">
            재고 등록
          </button>
        </div>
      </div>
    </div>
    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th class="text-center w-aaa">품목기준코드</th>
            <th class="text-center w-bbb">제품명</th>
            <th class="text-center w-aaa">재고</th>
            <th class="text-center w-aaa">단가</th>
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
        <VaButton @click="prevPage" :disabled="currentPage === 1"
          >이전</VaButton
        >
        <VaButton disabled>{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount"
          >다음</VaButton
        >
      </div>
    </div>
    <!-- 재고 등록 모달 -->
    <div>
      <StockRegi v-if="showRegisterModal" @close="closeRegisterModal" />
    </div>
  </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import StockRegi from "@/components/StockRegi.vue";
import { VaSelect, VaInput, VaButton } from "vuestic-ui";
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue'

const stockList = ref([]);
const selectedField = ref(null);
const filter = ref("");
const currentPage = ref(1);
const perPage = ref(15);
const showRegisterModal = ref(false);

const filterOptions = ref([
  { text: "품목코드", value: "proCode" },
  { text: "제품명", value: "proName" },
]);

const filteredStockList = computed(() => {
  if (!filter.value || !selectedField.value) {
    return stockList.value;
  }
  return stockList.value.filter((stock) =>
    String(stock[selectedField.value])
      .toLowerCase()
      .includes(filter.value.toLowerCase())
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
  axios
    .get("/api/stocks/all")
    .then((response) => {
      stockList.value = response.data;
    })
    .catch((error) => {
      console.error("재고 목록을 가져오는 데 실패했습니다:", error);
    });
}

function openRegisterModal() {
  showRegisterModal.value = true;
}

function closeRegisterModal() {
  showRegisterModal.value = false;
  fetchStockList(); // 재고 목록 갱신
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
  return typeof price === "number" ? price.toLocaleString() : price;
}

onMounted(() => {
  fetchStockList();
});
</script>

<style>
.flex {
    display: flex;
  }

  .sidebar {
    width: 250px; /* 사이드바의 너비를 조절하세요 */
    /* 필요에 따라 추가 스타일링 */
  }
.va-table-responsive {
  overflow: auto;
  min-height: 2000px;
}

.va-table {
  width: 800px;
  table-layout: fixed;
  overflow-y: auto;
}

.filter-options {
  width: 200px;
}

.search-input {
  width: 300px;
}

.register-button-container {
  display: flex;
  justify-content: flex-end;
}

/* 필터링 필드 선택과 검색 입력 간격 조절 */
.va-table-responsive .va-input {
  margin-left: 10px;
}

.va-table th {
  font-size: 16px;
  text-align: center;
}

.va-table td.text-center {
  text-align: center;
}

.va-table td.text-right {
  text-align: right;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
}

.filter-options {
  display: flex;
  align-items: center;
}

.register-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
  background-color: #0056b3;
}

.w-aaa {
  width: 16.66%;
}

.w-bbb {
  width: 40%;
}
</style>

