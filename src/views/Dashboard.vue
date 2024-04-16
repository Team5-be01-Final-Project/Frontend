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
        <button @click="refreshData">데이터 새로 고침</button>
        <p>마지막 업데이트: {{ lastUpdated }}</p>
        <div class="warehouse-container">
          <Warehouse ref="warehouseRef" />
        </div>
        <div class="car-temp-barchart-container">
          <CarTempBarchart ref="carTempBarchartRef" />
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
import { useRoute } from 'vue-router';
import CarTempBarchart from "@/components/charts/CarTempBarchart.vue";
import Warehouse from "@/components/charts/Warehouse.vue";
import POI from "@/components/charts/POI.vue";
import POIMap from "@/components/charts/POIMap.vue";
import MonthSale from "@/components/charts/MonthSale.vue";
import TopEmployee from "@/components/charts/TopEmployee.vue";

const route = useRoute();

// 현재 연도 가져오기 및 연도 배열 생성
const currentYear = new Date().getFullYear();
const years = ref(Array.from({ length: 5 }, (_, i) => currentYear - i));
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const lastUpdated = ref(new Date().toLocaleString());

// ref()를 사용하여 컴포넌트 참조 생성
const warehouseRef = ref(null);
const carTempBarchartRef = ref(null);

const componentRefs = [warehouseRef, carTempBarchartRef];
const refreshData = async () => {
  try {
    for (const componentRef of componentRefs) {
      if (componentRef.value && componentRef.value.fetchData) {
        await componentRef.value.fetchData();
      }
    }
    lastUpdated.value = new Date().toLocaleString();
  } catch (error) {
    console.error("Failed to refresh data:", error);
  }
};
</script>


<style scoped>
.dashboard-container {
  width: 100vw;
  margin: 0;
  margin-top: 60px;
  /* 네비게이션 바 아래로 60px 여백 추가 */
  padding: 20px;
  overflow: visible;
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

.warehouse-container {
  margin-bottom: 20px;
}

/* 아래쪽 그리드 스타일 */
.grid-bottom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: 70vh;
}

.poi-container {
  height: 550px;
  /* 높이는 유지 */
  overflow: auto;
  /* 내용이 넘칠 경우 자동으로 스크롤바 생성 */
  /* 기존 스타일은 유지 */
}

/* POI 정보 및 월별 매출 차트 컨테이너 스타일 */
.poi-container,
.month-sale-container {
  height: 550px;
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
</style>