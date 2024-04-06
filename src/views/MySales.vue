<!-- MySales.vue -->
<template>
  <div class="my-sales-container">
    <h2>My 영업</h2>
    <div class="info-section">
      <MyEmployeeInfo :employee="employee" />
    </div>
    <div class="client-section">
      <MyClientList :clients="clients" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import MyEmployeeInfo from '@/components/my/MyEmployeeInfo.vue';
import MyClientList from '@/components/my/MyClientList.vue';

const employee = ref({});
const clients = ref([]);

onMounted(async () => {
  const empCode = Cookies.get('empCode');
  try {
    // My 영업 정보 조회 API 호출
    const response = await axios.get(`/mysales/${empCode}`);
    const data = response.data;
    employee.value = data.employee;
    clients.value = data.clients;
  } catch (error) {
    console.error('My 영업 정보를 가져오는데 실패했습니다.', error);
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
  margin-bottom: 20px; /* 추가 간격 */
}

.employee-photo {
  margin-right: 20px; /* 사진과 정보 사이의 간격 */
}

/* 이미지와 정보를 수평 정렬 */
.employee-info-container {
  display: flex;
  align-items: center;
}

.employee-details {
  display: flex;
  flex-direction: column;
}

.client-section {
  margin-top: 20px; /* 거래처 목록이 다음 섹션으로 나뉘어질 수 있도록 여백을 추가 */
}

</style>
