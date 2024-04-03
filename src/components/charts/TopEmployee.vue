<!-- TopEmployee.vue -->
<template>
    <div class="top-employee">
      <h4>이달의 최우수 사원</h4>
      <div v-if="salesRankTopEmployee">
        <img :src="salesRankTopEmployee.empImg" alt="최우수 사원 사진" />
        <p>{{ salesRankTopEmployee.empName }} ({{ salesRankTopEmployee.deptName }})</p>
        <p>매출: {{ formatCurrency(salesRankTopEmployee.voucMonthSales) }}</p>
      </div>
      <div v-else>
        <p>이달의 최우수 사원이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  });
  
  const salesRankTopEmployee = ref(null);
  
  const fetchSalesRankTopEmployee = async () => {
    try {
      const response = await axios.get(`/incentive/list?year=${props.year}&month=${props.month}`);
      const incentiveList = response.data;
      
      salesRankTopEmployee.value = incentiveList.find(dto => dto.salesRank === 1);
    } catch (error) {
      console.error('인센티브 정보를 가져오는데 실패했습니다.', error);
    }
  };
  
  watch(() => [props.year, props.month], fetchSalesRankTopEmployee, { immediate: true });
  
  // 금액을 통화 형식으로 포매팅하는 함수
  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  }
  </script>
  
  <style scoped>
  .top-employee {
    margin-top: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }
  .top-employee img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  </style>