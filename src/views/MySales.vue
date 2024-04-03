<!-- MySales.vue -->
<template>
    <div class="my-sales-container">
      <h2>My 영업</h2>
      <div class="employee-info-container">
        <h3>사원 정보</h3>
        <div class="employee-info">
          <img :src="empImg" alt="사원 사진" />
          <p>사원명: {{ empName }}</p>
          <p>사원코드: {{ empCode }}</p>
          <p>연락처: {{ empTel }}</p>
          <p>이메일: {{ empEmail }}</p>
          <p>부서: {{ department }}</p>
          <p>직급: {{ position }}</p>
        </div>
      </div>
      <div class="client-list-container">
        <h3>담당 거래처 목록</h3>
        <table>
          <thead>
            <tr>
              <th>거래처코드</th>
              <th>거래처명</th>
              <th>거래처분류</th>
              <th>대표자</th>
              <th>주소</th>
              <th>담당자</th>
              <th>전화번호</th>
              <th>거래시작일</th>
              <th>거래종료일</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clientList" :key="client.clientCode">
              <td>{{ client.clientCode }}</td>
              <td>{{ client.clientName }}</td>
              <td>{{ client.clientClass }}</td>
              <td>{{ client.clientBoss }}</td>
              <td>{{ client.clientWhere }}</td>
              <td>{{ client.clientEmp }}</td>
              <td>{{ client.clientEmpTel }}</td>
              <td>{{ formatDate(client.clientStart) }}</td>
              <td>{{ formatDate(client.clientEnd) }}</td>
              <td>{{ client.clientNote }}</td>
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
  
  const empCode = ref('');
  const empName = ref('');
  const empTel = ref('');
  const empEmail = ref('');
  const empImg = ref('');
  const department = ref('');
  const position = ref('');
  const clientList = ref([]);
  
  onMounted(async () => {
    // 쿠키에서 사원 정보 가져오기
    empCode.value = Cookies.get('empCode');
    empName.value = Cookies.get('empName');
    empImg.value = Cookies.get('empImg');
  
    try {
      // 사원 정보 조회 API 호출
      const employeeResponse = await axios.get(`/api/employees/${empCode.value}`);
      const employeeData = employeeResponse.data;
      empTel.value = employeeData.empTel;
      empEmail.value = employeeData.empEmail;
      department.value = employeeData.department.deptName;
      position.value = employeeData.positions.posName;
  
      // 담당 거래처 목록 조회 API 호출
      const clientResponse = await axios.get(`/api/clients/employee/${empCode.value}`);
      clientList.value = clientResponse.data;
    } catch (error) {
      console.error('사원 정보 또는 거래처 목록을 가져오는데 실패했습니다.', error);
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
  