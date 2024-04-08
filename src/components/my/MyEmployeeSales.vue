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
          <th>상품명</th>
          <th>판매가</th>
          <th>매출원가</th>
          <th>매출액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in employeeSales" :key="sale.id">
          <td>{{ sale.clientName }}</td>
          <td>{{ sale.proName }}</td>
          <td>{{ formatPrice(sale.voucSale) }}</td>
          <td>{{ formatPrice(sale.costOfSales) }}</td>
          <td>{{ formatPrice(sale.voucSales) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script setup>
import { ref, defineProps } from "vue";
import axios from "axios";

// 부모 컴포넌트로부터 전달받은 속성 정의
const props = defineProps({
  empCode: {
    type: Number,
    required: true,
  },
});

// 선택된 년도와 월을 저장할 변수 초기화
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);

// 매출 정보를 저장할 배열 초기화
const employeeSales = ref([]);

// 매출 정보 조회 함수
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
  } catch (error) {
    console.error("내 매출 정보를 가져오는데 실패했습니다.", error);
  }
};

// 가격을 형식에 맞게 변환하는 함수
function formatPrice(price) {
  return typeof price === "number" ? price.toLocaleString() : price;
}

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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