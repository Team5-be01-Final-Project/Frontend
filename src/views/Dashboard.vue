<!-- Dashboard.vue -->
<template>
  <div class="dashboard-container">
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
      <!-- 차트 그룹 컴포넌트(온도) -->
      <div class="chart-group-container">
        <div class="warehouse-container">
          <button class="refresh-button" @click="refreshData"> <va-icon spin="clockwise" name="refresh" /></button>
          <Warehouse ref="warehouseRef" />
        </div>
        <div class="car-temp-barchart-container">
          <CarTempBarchart ref="carTempBarchartRef" />
        </div>
        <p class="update">마지막 업데이트: {{ lastUpdated }}</p>
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
import { debounce } from 'lodash-es'; // lodash의 debounce 함수 임포트

const route = useRoute();

// 현재 연도 가져오기 및 연도 배열 생성
const currentYear = new Date().getFullYear();
const years = ref(Array.from({ length: 5 }, (_, i) => currentYear - i));
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const lastUpdated = ref(new Date().toLocaleString());
const isLoading = ref(false);  // 데이터 로딩 상태를 추적하는 변수

// ref()를 사용하여 컴포넌트 참조 생성
const warehouseRef = ref(null);
const carTempBarchartRef = ref(null);
const componentRefs = [warehouseRef, carTempBarchartRef];

// refreshData 함수에 debounce 적용
const refreshData = debounce(async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    for (const componentRef of componentRefs) {
      if (componentRef.value && componentRef.value.fetchData) {
        await componentRef.value.fetchData();
      }
    }
    lastUpdated.value = new Date().toLocaleString();
  } catch (error) {
    console.error("Failed to refresh data:", error);
  } finally {
    isLoading.value = false;
  }
}, 1000); // 1초 동안의 중복 호출 무시
</script>


<style scoped>
.dashboard-container {
  width: calc(100vw - 40px); /* 총 가로 패딩을 뺀 너비 */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 연도/월 선택 컨테이너 스타일 */
.date-selectors-container {
  margin-bottom: 10px;
}

/* 차량 온도 막대 차트 컨테이너 스타일 */
.car-temp-barchart-container {
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warehouse-container {
  margin-bottom: 30px;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.va-table {
  min-width: 1000px;
  /* width: 100%; 테이블의 너비를 부모 컨테이너에 맞게 조정 */
  /* max-width: 100%; 테이블의 최대 너비를 부모 컨테이너의 너비로 제한 */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 패딩과 테두리를 포함한 총 크기를 요소의 크기로 계산 */
}

.refresh-button {
  position: absolute;
  right: 50px; /* 컨테이너의 우측에 위치 */
  background-color: #f5f5f5; /* 배경색 설정 */
  color: black; /* 버튼 텍스트 색상 */
  padding: 10px 10px; /* 패딩 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 테두리 둥글게 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
}

.refresh-button:hover {
  background-color: #f5f5f5; /* 호버 상태의 배경색 변경 */
}

.update {
  text-align: right;
  font-size: 14px;
  margin-top: 10px;
}

</style>