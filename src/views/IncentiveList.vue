<template>
    <div>
      <h1>직원 인센티브 목록</h1>
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
          <tr v-for="item in incentives" :key="item.empName">
            <td>{{ item.empName }}</td>
            <td>{{ item.deptCode }}</td>
            <td>{{ item.voucMonthSales }}</td>
            <td>{{ item.salesRank }}</td>
            <td>{{ item.incentive }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        incentives: []
      }
    },
    mounted() {
      this.fetchIncentives();
    },
    methods: {
      async fetchIncentives() {
        try {
          const response = await axios.get('/incentive/list?month=2');
          this.incentives = response.data;
        } catch (error) {
          console.error("인센티브 데이터를 가져오는 중 에러가 발생했습니다.", error);
        }
      }
    }
  }
  </script>
  
  <style>
  /* 여기에 스타일을 추가하세요 */
  table {
    width: 100%;
    border-collapse: collapse;
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