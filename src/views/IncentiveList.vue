<template>
    <div>
      <h1>직원 인센티브 목록</h1>
      <div>
        <va-select
          v-model="selectedDepartment"
          placeholder="부서 선택"
          :options="deptOption"
        />
        <va-select
          v-model="selectedMonth"
          placeholder="월 선택"
          :options="monthOption"
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
  import { departmentOptions } from '../utils/departmentOptions.js'; 
  import { monthOptions } from '../utils/monthOptions.js'; 
  import formatNumberWithCommas from '../utils/formatNumberWithCommas.js';
  
  export default {
    data() {
      const currentMonth = new Date().getMonth() + 1; // getMonth()는 0에서 시작하므로 +1
      return {
        incentives: [],
        selectedDepartment: '',
        deptOption: departmentOptions.map(dept => ({ text: dept.text, value: dept.value })),
        selectedMonth: currentMonth.toString() ,
        selectedMonthhistory: currentMonth.toString(),
        monthOption: monthOptions.map(dept => ({ text: dept.text, value: dept.value })),
        filteredData: [] // 필터링된 데이터를 저장할 배열
      }
    },
    mounted() {
      this.fetchIncentives(this.selectedMonth);
    },
    methods: {
      async fetchIncentives(month) {
        try {
          const response = await axios.get(`/incentive/list?month=${month}`);
          this.incentives = response.data;
          this.filteredData = response.data; // 초기 상태에서는 모든 데이터를 표시
        } catch (error) {
          console.error("인센티브 데이터를 가져오는 중 에러가 발생했습니다.", error);
        }
        this.selectedMonthhistory = this.selectedMonth; // 비동기 호출이 성공한 후 업데이트
      },
      formatNumberWithCommas,
      async applyFilter() {
          // 월 변경 시 데이터 다시 가져오기
        if(this.selectedMonth !== this.selectedMonthhistory){
          await this.fetchIncentives(this.selectedMonth.value);
        }
        this.fetchFilterDept();
      },

      fetchFilterDept() {
        if (!this.selectedDepartment || this.selectedDepartment.value === '') {
          this.filteredData = this.incentives;
        } else {
          this.filteredData = this.incentives.filter(item => item.deptName === this.selectedDepartment.text);
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
  </style>../utils/departmentCodeOptions.js/index.js