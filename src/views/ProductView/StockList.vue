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

// 데이터와 상태 관리를 위한 변수들
const stockList = ref([]); // 서버에서 받아온 재고 목록을 저장하는 배열
const selectedField = ref(null); // 사용자가 선택한 필터링 필드를 저장하는 변수
const filter = ref(""); // 사용자가 입력한 검색어를 저장하는 변수
const currentPage = ref(1); // 현재 페이지 번호를 저장하는 변수
const perPage = ref(15); // 페이지당 보여줄 항목 수를 저장하는 변수
const showRegisterModal = ref(false); // 재고 등록 모달의 표시 여부를 저장하는 변수

const filterOptions = ref([ // 필터링 옵션 목록
  { text: "품목코드", value: "proCode" },
  { text: "제품명", value: "proName" },
]);

// 필터링 및 페이지네이션된 재고 목록을 계산하는 computed 속성들
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

const pageCount = computed(() => { // 전체 페이지 수를 계산하는 computed 속성
  return Math.ceil(filteredStockList.value.length / perPage.value);
});

// 서버에서 재고 목록을 가져오는 비동기 함수
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

  /* 테이블과 필터 옵션 컨테이너의 스타일 */
  .va-table-responsive {
    overflow: auto; /* 가로 스크롤이 필요한 경우 오버플로우 설정 */
    min-height: 2000px; /* 최소 높이 설정 */
  }


  .va-table {
    width: 800px; /* 테이블 너비 고정 */
    table-layout: fixed; /* 테이블 너비 고정 */
    overflow-y: auto; /* 세로 스크롤이 필요한 경우 오버플로우 설정 */
  }

  .filter-options-container {
    display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
    align-items: center; /* 세로 중앙 정렬을 위해 요소들을 수직 정렬 */
    justify-content: space-between; /* 각 요소들을 좌우로 동일한 간격으로 배치 */
    margin-bottom: 20px; /* 아래 여백 추가 */
  }

  /* 필터 옵션 스타일 */
  .filter-options {
    display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
    align-items: center; /* 세로 정렬을 위해 요소들을 수직 정렬 */
  }

  .filter-select {
    width: 200px; /* 필터 옵션의 너비 설정 */
    margin-right: 10px; /* 필터 옵션과 검색 입력 간격 조절 */
  }

  /* 검색 입력 필드 스타일 */
  .search-input {
    flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  }

  /* 재고 등록 버튼 컨테이너 스타일 */
  .register-button-container {
    display: flex; /* 요소들을 가로로 나란히 표시하기 위해 flex 사용 */
    align-items: center; /* 세로 중앙 정렬을 위해 요소들을 수직 정렬 */
  }

  /* 재고 등록 버튼 스타일 */
  .register-button {
    padding: 10px 20px; /* 내부 여백 설정 */
    color: #fff; /* 글자색 설정 */
    border: none; /* 테두리 없음 */
    border-radius: 4px; /* 테두리 모서리 둥글게 설정 */
    cursor: pointer; /* 마우스 커서 설정 */
    font-size: 16px; /* 글자 크기 설정 */
    height: 40px; /* 버튼 높이 설정 */
    background: linear-gradient(145deg, #3489d4, #505ed8, #5bc0f2, #27a3bb); /* 그라데이션 배경 색상 */
    background-size: 400% 400%; /* 그라데이션 크기 설정 */
    animation: gradient-animation 10s ease infinite; /* 그라데이션 애니메이션 설정 */
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); /* 그림자 설정 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* 글자 그림자 설정 */
  }

  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* 재고 등록 버튼 호버 시 스타일 */
  .register-button:hover {
    background: linear-gradient(145deg, #26748a, #3940bf, #5e1aad, #0d624b); /* 호버 시 그라데이션 배경 색상 변경 */
    animation: none; /* 호버 시 그라데이션 애니메이션 중지 */
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3); /* 그림자 설정 */
  }

  /* 필터링 필드 선택과 검색 입력 간격 조절 */
  .va-table-responsive .va-input {
    margin-left: 10px; /* 왼쪽 여백 설정 */
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
    margin: 0 5px; /* 버튼 간격 설정 */
  }

  /* 테이블 컬럼 너비 지정을 위한 클래스 */
  .w-aaa {
    width: 16.66%; /* 너비 설정 */
  }

  .w-bbb {
    width: 40%; /* 너비 설정 */
  }
</style>