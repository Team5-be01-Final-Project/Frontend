<!-- MySales.vue -->
<template>
  <div class="my-sales-container">
    <h2>My 영업</h2>
    <div class="info-section">
      <MyEmployeeInfo :employee="employee" />
    </div>
    <div class="second-row">
      <div class="client-section">
        <MyClientList :clients="clients" />
      </div>
      <div class="sales-container">
        <!-- MyEmployeeSales 컴포넌트에서 update-current-sales 이벤트를 받아 현재 매출액 업데이트 -->
        <MyEmployeeSales
          :empCode="employee.empCode"
          @update-current-sales="handleUpdateCurrentSales"
        />
      </div>
    </div>
    <div class="third-row">
      <div class="simulation-container">
        <!-- MySimulation 컴포넌트에 empCode와 currentSales 전달 -->
        <MySimulation
          :empCode="employee.empCode"
          :currentSales="currentSales"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import MyEmployeeInfo from "@/components/my/MyEmployeeInfo.vue";
import MyClientList from "@/components/my/MyClientList.vue";
import MyEmployeeSales from "@/components/my/MyEmployeeSales.vue";
import MySimulation from "@/components/my/MySimulation.vue";

// 직원 정보와 거래처 목록을 저장할 반응형 변수
const employee = ref({});
const clients = ref([]);

// 현재 매출액을 저장할 반응형 변수
const currentSales = ref(0);

// MyEmployeeSales 컴포넌트에서 보내온 현재 매출액을 currentSales에 업데이트
const handleUpdateCurrentSales = (total) => {
  currentSales.value = total;
};

// 컴포넌트가 마운트되면 직원 정보와 거래처 목록을 가져옴
onMounted(async () => {
  const empCode = Cookies.get("empCode");
  try {
    // My 영업 정보 조회 API 호출
    const response = await axios.get(`/mysales/${empCode}`);
    const data = response.data;
    employee.value = data.employee;
    clients.value = data.clients;
  } catch (error) {
    console.error("My 영업 정보를 가져오는데 실패했습니다.", error);
  }
});
</script>

<style scoped>
/* My 영업 컨테이너 스타일 */
.my-sales-container {
  display: flex;
  flex-direction: column;
}

/* 직원 정보 섹션 스타일 */
.info-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 하단 여백 20px 추가 */
}

/* 직원 사진 스타일 */
.employee-photo {
  margin-right: 20px; /* 오른쪽 여백 20px 추가 */
}

/* 직원 정보 컨테이너 스타일 */
.employee-info-container {
  display: flex;
  align-items: center;
}

/* 직원 정보 세부 사항 스타일 */
.employee-details {
  display: flex;
  flex-direction: column;
}

/* 두 번째 행 스타일 */
.second-row {
  display: flex;
}

/* 거래처 섹션 스타일 */
.client-section {
  flex: 0 0 auto; /* flex-grow를 0으로 설정하여 요소의 크기가 늘어나지 않도록 함 */
  width: 350px; /* 너비를 350px로 설정 */
  max-width: 100%; /* 최대 너비를 부모 컨테이너 크기로 제한 */
  overflow-x: auto; /* 가로 방향으로 내용이 넘칠 경우 스크롤 표시 */
  height: 500px; /* 높이를 500px로 설정 */
  overflow-y: auto; /* 세로 방향으로 내용이 넘칠 경우 스크롤 표시 */
  margin-right: 20px; /* 오른쪽 여백 20px 추가 */
}

/* 매출 현황 섹션 스타일 */
.sales-container {
  flex: 1; /* 나머지 공간을 모두 차지하도록 설정 */
  max-width: 50%; /* 최대 너비를 50%로 제한 */
  overflow-x: auto; /* 가로 방향으로 내용이 넘칠 경우 스크롤 표시 */
}

/* 매출 테이블 스타일 */
.sales-table {
  width: 100%; /* 너비를 100%로 설정 */
  table-layout: fixed; /* 테이블 열 너비를 고정 */
  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
}

/* 매출 테이블 헤더와 셀 스타일 */
.sales-table th,
.sales-table td {
  padding: 8px; /* 셀 내부 여백 8px 설정 */
  border: 1px solid #ddd; /* 셀 경계선 스타일 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
  word-wrap: break-word; /* 긴 단어는 줄바꿈 */
  overflow-wrap: break-word; /* 긴 단어는 줄바꿈 (Internet Explorer 지원) */
}

/* 세 번째 행 스타일 */
.third-row {
  display: flex; /* 요소들을 가로로 배치 */
  margin-top: 10px; /* 상단 여백 10px 추가 */
}

/* Simulation 테이블 스타일 */
.simulation-table {
  width: auto; /* 너비를 자동으로 설정 */
  max-width: 600px; /* 최대 너비는 600px로 제한 */
  border-collapse: collapse; /* 테이블 셀 경계선을 한 줄로 표시 */
  margin-top: 10px; /* 상단 여백 10px 추가 */
}
</style>
