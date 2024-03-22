<template>
    <div class="employees-list">
        <div class="va-table-responsive">
            <h3 class="va-h3">사원 리스트 조회</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <VaSelect
                    v-model="selectedDept"
                    placeholder="부서"
                    :options="[
                        { text: '전체', value: '' },
                        { text: '이사회', value: '이사회' },
                        { text: '영업 1팀', value: '영업 1팀' },
                        { text: '영업 2팀', value: '영업 2팀' },
                        { text: '영업 3팀', value: '영업 3팀' },
                        { text: '시스템', value: '시스템' }
                    ]"
                    value-by="value"
                />
                <VaSelect
                    v-model="selectedSearchCondition"
                    placeholder="검색 조건"
                    :options="[
                        { text: '이름', value: 'empName' },
                        { text: '전화번호', value: 'empTel' },
                    ]"
                    value-by="value"
                />
                <VaInput
                    v-model="searchText"
                    placeholder="Filter..."
                    class="w-full"
                />
                <VaButton @click="fetchFilteredEmployees">검색</VaButton>
            </div>
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th>사번</th>
              <th>이름</th>
              <th>직급</th>
              <th>부서</th>
              <th>전화번호</th>
              <th>권한</th>
              <th>알림설정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.empCode">
              <td>{{ employee.empCode }}</td>
              <td>{{ employee.empName }}</td>
              <td>{{ employee.posName }}</td>
              <td>{{ employee.deptName }}</td>
              <td>{{ employee.empTel }}</td>
              <td>{{ employee.authName }}</td>
              <td>{{}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { VaButton } from 'vuestic-ui/web-components';

  
  export default {
    data() {
      return {
        employees: [],
        loading: true,
        currentPage: 1,
        selectedDept: null, // 부서 선택을 위한 변수
        selectedSearchCondition: null, // 검색 조건 선택을 위한 변수
        searchText: '' // 검색어 입력을 위한 변수
      };
    },
    created() {
      this.fetchEmployeesList();
    },
    methods: {
        async fetchFilteredEmployees() {
            try {
            const params = new URLSearchParams();
            if (this.selectedDept) {
                params.append('deptName', this.selectedDept);
            }
            if (this.searchText && this.selectedSearchCondition) {
                params.append(this.selectedSearchCondition, this.searchText);
            }
            const response = await axios.get(`http://localhost:8081/employees/list?${params.toString()}`);
            this.employees = response.data;
            } catch (error) {
            console.error('필터링된 데이터 가져오기 실패:', error);
            }
        },
        async fetchEmployeesList() {
            try {
            const response = await axios.get(`http://localhost:8081/employees/list?`);
            this.employees = response.data; // 응답 데이터 할당
            } catch (error) {
            console.error('데이터 가져오기 실패:', error);
            } finally {
            this.loading = false;
            }
        }
    }
  };
  </script>
  
  <style>
  .va-table-responsive {
    overflow: auto;
  }
  .pagination {
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

  </style>