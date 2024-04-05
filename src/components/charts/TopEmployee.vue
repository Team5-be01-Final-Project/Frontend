<!-- TopEmployee.vue -->
<template>
  <div class="top-employee">
    <h4>이달의 최우수 사원</h4>
    <!-- 최우수 사원 정보가 있을 경우 -->
    <div v-if="salesRankTopEmployee">
      <!-- 최우수 사원 사진 -->
      <img :src="salesRankTopEmployee.empImg" alt="최우수 사원 사진" />
      <!-- 최우수 사원 이름과 부서 -->
      <p>
        {{ salesRankTopEmployee.empName }} ({{ salesRankTopEmployee.deptName }})
      </p>
      <!-- 최우수 사원의 매출액 -->
      <p>매출: {{ formatCurrency(salesRankTopEmployee.voucMonthSales) }}</p>
    </div>
    <!-- 최우수 사원 정보가 없을 경우 -->
    <div v-else>
      <p>이달의 최우수 사원이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
});

const salesRankTopEmployee = ref(null);

const fetchSalesRankTopEmployee = async () => {
  try {
    const response = await axios.get(
      `/incentive/list?year=${props.year}&month=${props.month}`
    );
    const incentiveList = response.data;
    salesRankTopEmployee.value = incentiveList.find(
      (dto) => dto.salesRank === 1
    );
  } catch (error) {
    console.error("인센티브 정보를 가져오는데 실패했습니다.", error);
  }
};

// onMounted 훅을 사용하여 컴포넌트가 마운트된 후 최우수 사원 정보를 가져옵니다.
onMounted(fetchSalesRankTopEmployee);

function formatCurrency(amount) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}
</script>

<style scoped>
/* 최우수 사원 정보 컨테이너 스타일 */
.top-employee {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

/* 최우수 사원 사진 스타일 */
.top-employee img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>