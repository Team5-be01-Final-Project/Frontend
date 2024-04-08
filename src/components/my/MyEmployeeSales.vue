<!-- MyEmployeeSales.vue -->
html


Copy code
<template>
  <div class="employee-sales">
    <h3>내 매출 현황</h3>
    <div class="sales-table">
      <table>
        <thead>
          <tr>
            <th>거래처명</th>
            <th v-for="(month, index) in recentMonths" :key="index">{{ month }}</th>
            <th>거래처 총 매출액</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in employeeSales" :key="index">
            <td>{{ sale.clientName }}</td>
            <td v-for="(monthlySale, index) in sale.monthlySales" :key="index">
              {{ formatCurrency(monthlySale) }}
            </td>
            <td>{{ formatCurrency(totalSalesByClient(sale.monthlySales)) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>월별 총액</td>
            <td v-for="(monthlyTotal, index) in totalSalesByMonth" :key="index">
              {{ formatCurrency(monthlyTotal) || '' }}
            </td>
            <td></td> <!-- 거래처 총 매출액 열에서는 계산하지 않음 -->
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

// 직원의 매출 내역과 최근 3개월 데이터를 저장할 반응형 변수
const employeeSales = ref([]);
const recentMonths = ref([]);

// 거래처별 총 매출액 계산 함수
const totalSalesByClient = (monthlySales) =>
  monthlySales.reduce((sum, sale) => sum + sale, 0);

// 월별 총액 계산 computed 함수
const totalSalesByMonth = computed(() => {
  const totals = new Array(3).fill(0);
  employeeSales.value.forEach((sale) => {
    sale.monthlySales.forEach((monthlySale, index) => {
      totals[index] += monthlySale || 0; // 데이터가 없으면 0으로 취급
    });
  });
  return totals;
});

// update-current-sales 이벤트 정의
const emit = defineEmits(["update-current-sales"]);

// 이번 달 총 매출액을 계산하고 update-current-sales 이벤트 발생
const calculateCurrentSales = () => {
  const thisMonthTotal =
    totalSalesByMonth.value[totalSalesByMonth.value.length - 1];
  emit("update-current-sales", thisMonthTotal);
};

// 컴포넌트가 마운트되면 직원의 매출 내역과 최근 3개월 데이터를 가져옴
onMounted(async () => {
  const empCode = Cookies.get("empCode");
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const response = await axios.get("/sales/employeeSales", {
      params: {
        empCode,
        year,
        month,
      },
    });
    employeeSales.value = response.data;
    recentMonths.value = [];
    for (let i = 2; i >= 0; i--) {
      const targetMonth = new Date(year, month - 1 - i);
      const monthName = targetMonth.toLocaleString("default", {
        month: "long",
      });
      recentMonths.value.push(monthName);
    }

    // 현재 매출액 계산 및 이벤트 발생
    calculateCurrentSales();
  } catch (error) {
    console.error("내 매출 현황을 가져오는데 실패했습니다.", error);
  }
});

// 통화 형식으로 변환하는 함수
function formatCurrency(amount) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}
</script>

<style scoped>
/* 내 매출 현황 섹션 스타일 */
.employee-sales {
  margin-top: 20px;
}

/* 매출 테이블 스타일 */
.sales-table {
  width: 100%;
  overflow-x: auto; /* 넓이가 넘칠 경우 가로 스크롤 표시 */
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse; /* 테이블 셀 경계선 합치기 */
}

/* 테이블 헤더와 셀 스타일 */
th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd; /* 셀 하단 경계선 */
}

/* 테이블 헤더 스타일 */
th {
  background-color: #f2f2f2; /* 헤더 배경색 */
}

/* 통화 형식 셀 텍스트 오른쪽 정렬 */
.employee-sales td:not(:first-child) {
  text-align: right;
}

</style>