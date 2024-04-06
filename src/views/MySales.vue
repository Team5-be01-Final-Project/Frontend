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
        <MyEmployeeSales :empCode="employee.empCode" />
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
import MyEmployeeSales from '@/components/my/MyEmployeeSales.vue';

const employee = ref({});
const clients = ref([]);

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
.my-sales-container {
  display: flex;
  flex-direction: column;
}

.info-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.employee-photo {
  margin-right: 20px;
}

.employee-info-container {
  display: flex;
  align-items: center;
}

.employee-details {
  display: flex;
  flex-direction: column;
}

.second-row {
  display: flex;
  /* justify-content: space-between; */
}

.client-section {
  flex: 0 0 auto; /* flex-grow를 0으로 설정하여 요소의 크기가 늘어나지 않도록 함 */
  width: 350px; /* 원하는 너비를 픽셀 값으로 설정 */
  max-width: 100%; /* 부모 컨테이너를 넘어서지 않도록 함 */
  overflow-x: auto; /* 내용이 넘칠 경우 스크롤 표시 */
  height: 500px; /* 원하는 높이를 픽셀 값으로 설정 */
  overflow-y: auto; /* 내용이 높이를 넘칠 경우 스크롤 표시 */
  margin-right: 20px; /* 원하는 간격을 설정 */
}

.sales-container {
  flex: 1;
  max-width: 50%;
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  table-layout: fixed;
  white-space: nowrap;
}

.sales-table th,
.sales-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
