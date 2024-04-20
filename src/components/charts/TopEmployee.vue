<!-- TopEmployee.vue -->
<template>
  <h4>이달의 최우수 사원</h4>
  <div class="top-employee">
    <!-- 최우수 사원 정보가 있을 경우 -->
    <div v-if="salesRankTopEmployee">
      <!-- 최우수 사원 사진 -->
      <div class="employee-image">
        <img :src="salesRankTopEmployee.empImg" alt="최우수 사원 사진" />
        <!-- <img src="crown.png" alt="1등 아이콘" class="crown-icon" /> -->
      </div>
      <!-- 최우수 사원 이름과 부서 -->
      <p class="employee-name">
        {{ salesRankTopEmployee.empName }} ({{ salesRankTopEmployee.deptName }})
      </p>
      <!-- 최우수 사원의 매출액 -->
      <p class="employee-sales">
        매출 : {{ formatCurrency(salesRankTopEmployee.voucMonthSales) }}
      </p>
    </div>
    <!-- 최우수 사원 정보가 없을 경우 -->
    <div v-else>
      <p>이달의 최우수 사원이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

// 부모 컴포넌트로부터 year와 month props 받기
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

// 최우수 사원 정보를 저장할 reactive 변수
const salesRankTopEmployee = ref(null);

// 최우수 사원 정보를 가져오는 함수
const fetchSalesRankTopEmployee = async () => {
  try {
    // 인센티브 정보 API 호출
    const response = await axios.get(
      `/incentive/list?year=${props.year}&month=${props.month}`
    );
    const incentiveList = response.data;
    // 인센티브 정보에서 salesRank가 1인 사원 찾기
    salesRankTopEmployee.value = incentiveList.find(
      (dto) => dto.salesRank === 1
    );
  } catch (error) {
    console.error("인센티브 정보를 가져오는데 실패했습니다.", error);
  }
};

// year 또는 month props가 변경될 때마다 최우수 사원 정보 갱신
watch(() => [props.year, props.month], fetchSalesRankTopEmployee, {
  immediate: true,
});

// 금액을 통화 형식으로 포매팅하는 함수
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
  height: 450px;
  padding: 20px;
  background-color: #ffffff;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  text-align: center;
  margin-top: 20px;
  position: relative;
}

/* 최우수 사원 사진 스타일 */
.employee-image {
  position: relative;
  display: inline-block;
}

.employee-image img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.crown-icon {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
}

h4 {
  font-size: 20px;
}

.employee-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.employee-sales {
  font-size: 17px;
}
</style>