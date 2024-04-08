<!-- MyEmployeeSales.vue -->
<template>
  <h3>내 매출 보기</h3>
  <div class="employee-sales">
    <!-- 년도와 월 선택 영역 -->
    <div class="select-period">
      <div class="select-year">
        <input type="number" id="year" v-model="selectedYear" />
        <label for="year">년</label>
      </div>
      <div class="select-month">
        <input type="number" id="month" v-model="selectedMonth" />
        <label for="month">월</label>
      </div>
      <button @click="fetchEmployeeSales" class="btn-fetch">조회</button>
    </div>
    <!-- 매출 정보 테이블 -->
    <table class="sales-table">
      <thead>
        <tr>
          <th>거래처명</th>
          <th v-for="(month, index) in recentMonths" :key="index">{{ month }}</th>
          <th>합계</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sale, index) in employeeSales" :key="index">
          <td>{{ sale.clientName }}</td>
          <td v-for="(monthlySale, index) in sale.monthlySales" :key="index">
            {{ formatPrice(monthlySale) }}
          </td>
          <td>{{ formatPrice(totalSalesByClient(sale.monthlySales)) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>합계</td>
          <td v-for="(monthlyTotal, index) in totalSalesByMonth" :key="index">
            {{ formatPrice(monthlyTotal) }}
          </td>
          <td>{{ formatPrice(totalSales) }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const props = defineProps({
  empCode: {
    type: Number,
    required: true,
  },
});

const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const employeeSales = ref([]);
const recentMonths = ref([]);

const fetchEmployeeSales = async () => {
  try {
    const response = await axios.get(`/sales/employeeSales`, {
      params: {
        empCode: props.empCode,
        year: selectedYear.value,
        month: selectedMonth.value,
      },
    });
    employeeSales.value = response.data;

    // 최근 3개월 설정
    const currentDate = new Date(selectedYear.value, selectedMonth.value - 1);
    recentMonths.value = [];
    for (let i = 0; i < 3; i++) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() - i);
      recentMonths.value.push(month.toLocaleString("default", { month: "long" }));
    }
  } catch (error) {
    console.error("내 매출 정보를 가져오는데 실패했습니다.", error);
  }
};

const totalSalesByMonth = computed(() => {
  const totals = new Array(3).fill(0);
  employeeSales.value.forEach((sale) => {
    sale.monthlySales.forEach((monthlySale, index) => {
      totals[index] += monthlySale;
    });
  });
  return totals;
});

const totalSales = computed(() => {
  return totalSalesByMonth.value.reduce((sum, total) => sum + total, 0);
});

const totalSalesByClient = (monthlySales) => {
  return monthlySales.reduce((sum, sale) => sum + sale, 0);
};

const formatPrice = (price) => {
  return price.toLocaleString();
};
</script>
  
  <style scoped>
.employee-sales {
  margin-top: 20px;
}

.select-period {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.select-year,
.select-month {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.btn-fetch {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table th,
.sales-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.sales-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>