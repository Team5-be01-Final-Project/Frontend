<!-- Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <h3 class="va-h3">대시보드</h3>
    <div class="grid-top">
      <!-- POI 지도 컴포넌트 -->
      <div class="poi-map-container">
        <POIMap />
      </div>
      <!-- 최우수 사원 정보 및 연도/월 선택 컴포넌트 그룹 -->
      <div class="top-employee-group-container">
        <div class="top-employee-container">
          <TopEmployee :year="selectedYear" :month="selectedMonth" />
        </div>
      </div>
      <!-- 차트 그룹 컴포넌트 -->
      <div class="chart-group-container">
        <!-- 창고 현황 차트 컴포넌트 -->
        <div class="warehouse-container">
          <Warehouse />
        </div>
        <!-- 차량 온도 막대 차트 컴포넌트 -->
        <div class="car-temp-barchart-container">
          <CarTempBarchart />
        </div>
      </div>
    </div>
    <div class="grid-bottom">
      <!-- POI 정보 컴포넌트 -->
      <div class="poi-container">
        <POI />
      </div>
      <!-- 월별 매출 차트 컴포넌트 -->
      <div class="month-sale-container">
        <MonthSale />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CarTempBarchart from "@/components/charts/CarTempBarchart.vue";
import Warehouse from "@/components/charts/Warehouse.vue";
import POI from "@/components/charts/POI.vue";
import POIMap from "@/components/charts/POIMap.vue";
import MonthSale from "@/components/charts/MonthSale.vue";
import TopEmployee from "@/components/charts/TopEmployee.vue";

// 현재 연도 가져오기
const currentYear = new Date().getFullYear();
// 현재 연도부터 과거 5년까지의 연도 배열 생성
const years = ref(Array.from({ length: 5 }, (_, i) => currentYear - i));
// 1월부터 12월까지의 월 배열 생성
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
// 선택된 연도 초기값 설정 (현재 연도)
const selectedYear = ref(currentYear);
// 선택된 월 초기값 설정 (현재 월)
const selectedMonth = ref(new Date().getMonth() + 1);
</script>

<style scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 20px;
  overflow: auto;
  /* 컨테이너 내용이 넘치면 스크롤바 생성 */
}

/* 위쪽 그리드 스타일 */
.grid-top {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

}


/* 최우수 사원 정보 및 차트 그룹 컨테이너 스타일 */
.top-employee-group-container,
.chart-group-container {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

/* 연도/월 선택 컨테이너 스타일 */
.date-selectors-container {
  margin-bottom: 10px;
}

/* 차량 온도 막대 차트 컨테이너 스타일 */
.car-temp-barchart-container {
  height: 300px;
}

/* 아래쪽 그리드 스타일 */
.grid-bottom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: 70vh;
}

/* POI 정보 및 월별 매출 차트 컨테이너 스타일 */
.poi-container,
.month-sale-container {
  height: 550px;
}

/* 기타 스타일 */
.va-table-responsive {
  overflow: auto;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

.va-table {
  min-width: 1000px;
}


/* 컴포넌트 테두리 스타일 및 box-sizing 적용 */
.poi-map-container,
.top-employee-group-container,
.chart-group-container,
.poi-container,
.month-sale-container {
  border: 2px solid #ECF0F1;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  /* 패딩과 테두리를 포함한 총 크기를 요소의 크기로 계산 */
}

/* 그리드 컨테이너 스타일 */
.grid-top,
.grid-bottom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* .grid-top의 경우 */
  /* grid-template-columns: repeat(2, 1fr); .grid-bottom의 경우 */
  gap: 20px;
  overflow: hidden;
  /* 내부 컴포넌트가 윤곽을 초과할 경우 숨김 */
  /* 또는 overflow: auto; 필요한 경우 스크롤바 생성 */
}
</style>