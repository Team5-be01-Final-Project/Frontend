<template>
  <div>
    <h4>월별 매출 현황</h4>
    <div class="chart-container">
      <canvas ref="monthlySalesChartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

const selectedYear = ref(new Date().getFullYear());
const years = ref(Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i));
const monthlySalesChartRef = ref(null);
let monthlySalesChart = null;

const fetchMonthlySales = async () => {
  try {
    const response = await axios.get(`/sales/monthlySales?year=${selectedYear.value}`);
    const monthlySalesData = response.data;
    const filledData = fillMissingMonths(monthlySalesData, selectedYear.value);
    // 데이터를 1000000으로 나누기
    const transformedData = filledData.map(data => {
      return {
        ...data,
        voucSales: data.voucSales / 1000000,
        totalGrossProfit: data.totalGrossProfit / 1000000
      };
    });
    updateChart(transformedData);
  } catch (error) {
    console.error("Failed to fetch monthly sales data:", error);
  }
};



const fillMissingMonths = (monthlySalesData, year) => {
  const filledData = [];
  for (let month = 1; month <= 12; month++) {
    const monthStr = month.toString().padStart(2, '0'); // 1 -> '01'
    const existingData = monthlySalesData.find(data => data.yearMonth === `${year}-${monthStr}`);
    if (existingData) {
      filledData.push(existingData);
    } else {
      filledData.push({ yearMonth: `${year}-${monthStr}`, voucSales: 0 });
    }
  }
  return filledData;
};

const updateChart = (filledData) => {
  const labels = filledData.map(data => `${data.yearMonth.split('-')[1]}월`);
  const salesData = filledData.map(data => data.voucSales);
  const grossProfitData = filledData.map(data => data.totalGrossProfit)

  if (monthlySalesChart) {
    monthlySalesChart.destroy();
  }

  const ctx = monthlySalesChartRef.value.getContext('2d');
  monthlySalesChart = new Chart(ctx, {
    type: 'bar', // 기본 유형을 바(bar)로 설정
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: '매출액(100만)',
          data: salesData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          type: 'line',
          label: '매출이익(100만)',
          data: grossProfitData,
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,

        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

onMounted(fetchMonthlySales);

watch(selectedYear, fetchMonthlySales);
</script>

<style>
.chart-container {
  height: 500px;
  /* 또는 적절한 높이로 설정 */
  width: 800px;
}

h4 {
  font-size: 20px;
  /* h4 태그의 폰트 사이즈를 키움 */
}
</style>