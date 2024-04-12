<!-- StockList.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div class="Main">
      <div class="flex justify-between items-center mb-6">
        <h3 class="va-h3">재고 조회</h3>
        </div>
      <div class="grid grid-cols-12 gap-4 mb-6 items-center">
        <VaSelect
          v-model="selectedField"
          placeholder="검색 조건"
          :options="filterOptions"
          value-by="value"
          class="col-span-2 filter-select"
        />
        <VaInput v-model="filter" placeholder="검색어 입력" class="col-span-8 search-input" />
        <VaButton @click="searchStockList" class="search-button col-span-2">검색</VaButton>
        <VaButton @click="openRegisterModal" class="register-button">재고 등록</VaButton>
      </div>
      <div class="right-align">단위 : 개 / 원</div>
      <div class="va-table-responsive">
        <table class="va-table va-table--hoverable full-width">
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
              <td class="text-right">{{ formatNumberWithCommas(stock.stoAmo) }}</td>
              <td class="text-right">{{ formatPrice(stock.proUnit) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
          <VaButton disabled>{{ currentPage }}</VaButton>
          <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
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
import ProductSidebar from "@/components/sidebar/ProductSidebar.vue";
import formatNumberWithCommas from "@/utils/formatNumberWithCommas";

// 데이터와 상태 관리를 위한 변수들
const stockList = ref([]); // 서버에서 받아온 재고 목록을 저장하는 배열
const selectedField = ref(null); // 사용자가 선택한 필터링 필드를 저장하는 변수
const filter = ref(""); // 사용자가 입력한 검색어를 저장하는 변수
const currentPage = ref(1); // 현재 페이지 번호를 저장하는 변수
const perPage = ref(15); // 페이지당 보여줄 항목 수를 저장하는 변수
const showRegisterModal = ref(false); // 재고 등록 모달의 표시 여부를 저장하는 변수

const filterOptions = ref([
  // 필터링 옵션 목록
  { text: "품목코드", value: "proCode" },
  { text: "제품명", value: "proName" },
]);

// 페이지네이션된 재고 목록을 계산하는 computed 속성
const paginatedStockList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return stockList.value.slice(start, start + perPage.value);
});

// 전체 페이지 수를 계산하는 computed 속성
const pageCount = computed(() => {
  return Math.ceil(stockList.value.length / perPage.value);
});

// 서버에서 재고 목록을 가져오는 비동기 함수
async function fetchStockList() {
  try {
    const response = await axios.get("/stocks/all");
    stockList.value = response.data;
  } catch (error) {
    console.error("재고 목록을 가져오는 데 실패했습니다:", error);
  }
}

// 재고 등록 모달을 열기 위한 함수
function openRegisterModal() {
  showRegisterModal.value = true;
}

// 재고 등록 모달을 닫기 위한 함수
function closeRegisterModal() {
  showRegisterModal.value = false;
  fetchStockList(); // 재고 목록을 갱신하여 최신 데이터를 반영
}

// 다음 페이지로 이동하는 함수
function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
}

// 이전 페이지로 이동하는 함수
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// 가격을 형식에 맞게 변환하는 함수
function formatPrice(price) {
  return typeof price === "number" ? price.toLocaleString() : price;
}

// 재고 검색 함수
const searchStockList = async () => {
  try {
    let proCode = null;
    let proName = null;

    if (selectedField.value === "proCode") {
      proCode = filter.value;
    } else if (selectedField.value === "proName") {
      proName = filter.value;
    }

    const response = await axios.get("/stocks/search", {
      params: {
        proCode: proCode,
        proName: proName,
      },
    });
    stockList.value = response.data;
    currentPage.value = 1; // 검색 후 현재 페이지를 1로 초기화
  } catch (error) {
    console.error("재고 검색에 실패했습니다:", error);
  }
};

// 컴포넌트가 마운트된 후 재고 목록을 가져오는 함수 호출
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

.filter-options-container {
  display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬을 위해 요소들을 수직 정렬 */
  justify-content: space-between; /* 각 요소들을 좌우로 동일한 간격으로 배치 */
  margin-bottom: 20px; /* 아래 여백 추가 */
}

/* 필터 옵션 스타일 */
.filter-select {
  margin-right: 5px; /* 오른쪽 마진 추가 */
}

/* 검색 입력 필드 스타일 */
.search-input {
  margin-right: 5px; /* 오른쪽 마진 추가 */
}

/* 재고 등록 버튼 컨테이너 스타일 */
.register-button-container {
  display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
  align-items: center; /* 세로 중앙 정렬을 위해 요소들을 수직 정렬 */
}

/* 테이블 헤더 및 셀 스타일 */
.va-table th {
  font-size: 16px; /* 글자 크기 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.va-table td.text-center {
  text-align: center; /* 텍스트 가운데 정렬 */
}

.va-table td.text-right {
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
  justify-content: center; /* 가운데 정렬 */
  margin-top: 20px; /* 위 여백 추가 */
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
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

.register-button {
    float: right; /* 버튼을 오른쪽으로 이동시킵니다. */
  }
</style>