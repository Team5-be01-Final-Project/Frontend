<!-- MySales.vue -->
<template>
    <div class="my-sales-container">
      <h2>My 영업</h2>
      <div class="employee-info-container">
        <h3>사원 정보</h3>
        <div class="employee-info">
          <img :src="employee.empImg" alt="사원 사진" />
          <p>사 원 명 : {{ employee.empName }}</p>
          <p>사원코드 : {{ employee.empCode }}</p>
          <p>연 락 처 : {{ employee.empTel }}</p>
          <p>이 메 일 : {{ employee.empEmail }}</p>
          <p>직    급 : {{ employee.positions?.posName }}</p>
          <p>부    서 : {{ employee.department?.deptName }}</p>

        </div>
      </div>
      <div class="client-list-container">
        <h3>담당 거래처 목록</h3>
        <table>
          <thead>
            <tr>
              <th>거래처명</th>
              <th>대표자</th>
              <th>주소</th>
              <th>담당자</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.clientCode">
              <td>{{ client.clientName }}</td>
              <td>{{ client.clientBoss }}</td>
              <td>{{ client.clientWhere }}</td>
              <td>{{ client.clientEmp }}</td>
              <td>{{ client.clientEmpTel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  
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
  
  // 날짜 포맷팅 함수
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  </script>
  
  <style scoped>
  /* 스타일 추가 */
  </style>