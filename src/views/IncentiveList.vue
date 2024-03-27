<template>
    <div>
      <h1>직원 인센티브 목록</h1>
      <div>
        <va-select
          v-model="selectedDepartment"
          placeholder="부서 선택"
          :options="deptOptions"
        />
        <VaButton @click="applyFilter">검색</VaButton>
      </div>
      <table>
        <thead>
          <tr>
            <th>직원 이름</th>
            <th>부서</th>
            <th>월 매출액</th>
            <th>판매 순위</th>
            <th>인센티브</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="item.empName">
            <td>{{ item.empName }}</td>
            <td>{{ item.deptName }}</td>
            <td class = 'money-right'>{{ formatNumberWithCommas(item.voucMonthSales) }}</td>
            <td>{{ item.salesRank }}</td>
            <td class = 'money-right'>{{ formatNumberWithCommas(item.incentive) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { departments } from '../utils/department.js'; 
  import formatNumberWithCommas from '../utils/formatNumberWithCommas.js';
  
  export default {
    data() {
      return {
        incentives: [],
        selectedDepartment: '',
        deptOptions: departments.map(dept => ({ text: dept.text, value: dept.text })),
        filteredData: [] // 필터링된 데이터를 저장할 배열
      }
    },
    mounted() {
      this.fetchIncentives();
    },
    methods: {
      async fetchIncentives() {
        try {
          const response = await axios.get('/incentive/list?month=3');
          this.incentives = response.data;
          this.filteredData = response.data; // 초기 상태에서는 모든 데이터를 표시
        } catch (error) {
          console.error("인센티브 데이터를 가져오는 중 에러가 발생했습니다.", error);
        }
      },
      formatNumberWithCommas,
      applyFilter() {
      if (!this.selectedDepartment) {
        this.filteredData = this.incentives;
      } else {
        this.filteredData = this.incentives.filter(item => item.deptName === this.selectedDepartment.value);
      }
    },

    }
  }
  </script>
  
  <style>
  /* 여기에 스타일을 추가하세요 */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  td.money-right {
    text-align: right;
  }

  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }

  
  thead {
    background-color: #f2f2f2;
  }
  </style>