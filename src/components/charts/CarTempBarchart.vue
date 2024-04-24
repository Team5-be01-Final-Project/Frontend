<template>
    <h4>현재 차량 온도</h4>
    <div class="carTempCharts">
        <div style="display: flex; align-items: center;">
            <canvas id="carTempChart"></canvas>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.css';
import { defineExpose } from 'vue'
Chart.register(...registerables);
import { ref, onMounted } from 'vue';

// 차트 인스턴스를 저장하기 위한 ref
const chartRef = ref(null);

// 컴포넌트가 마운트될 때 데이터를 한 번 가져옵니다.
onMounted(async () => {
    await fetchData();
});

// 데이터 가져오기 메서드
async function fetchData() {
    try {
        const response = await axios.get('/temp-logs');
        renderChart(response.data);
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
    }
}

// 차트 그리기 메서드
function renderChart(data) {
  const ctx = document.getElementById('carTempChart').getContext('2d');
  if (chartRef.value) {
    chartRef.value.destroy(); // 기존 차트가 있으면 삭제
  }

  // SRG10을 제외하고 storageCode를 숫자 부분에 따라 정렬
  const sortedKeys = Object.keys(data)
    .filter(key => key !== 'SRG10') // SRG10 제외
    .sort((a, b) => parseInt(a.substring(3)) - parseInt(b.substring(3)));

  // 정렬된 키에 따라 온도 값도 정렬
  const sortedTemps = sortedKeys.map(key => data[key]);

  // 파스텔톤 색상
  const pastelBlue = 'rgba(54, 162, 235, 0.2)';
  const pastelRed = 'rgba(255, 99, 132, 0.2)';

  chartRef.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedKeys, // 정렬된 차량 코드를 라벨로 사용
      datasets: [{
        label: '온도 (°C)',
        data: sortedTemps,
        backgroundColor: sortedTemps.map(temp => (temp >= 2 && temp <= 8) ? pastelBlue : pastelRed),
        borderColor: sortedTemps.map(temp => (temp >= 2 && temp <= 8) ? pastelBlue : pastelRed),
        borderWidth: 1,
        barThickness: 20 // 막대 두께 조정
      }]
    },
    options: {
      responsive: true, // 반응형 설정
      plugins: {
        legend: {
          position: 'top',
          align: 'end', // 오른쪽 정렬
          labels: {
            generateLabels: function(chart) {
              return [{
                text: '정상 온도',
                fillStyle: pastelBlue,
                strokeStyle: 'transparent', // 테두리선 제거
              }, {
                text: '이상 온도',
                fillStyle: pastelRed,
                strokeStyle: 'transparent', // 테두리선 제거
              }];
            }
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0, // y축의 최소값 설정
          max: 10, // y축의 최대값 설정
          ticks: {
            stepSize: 2 // y축의 간격 설정
          },
          grid: {
            display: false // 그래프 내부 줄 숨김
          }
        },
        x: {
          grid: {
            display: false // 그래프 내부 줄 숨김
          }
        }
      }
    }
  });
}

// 부모 컴포넌트가 접근할 수 있도록 fetchData 메서드를 공개합니다
defineExpose({
  fetchData
});

</script>

<style scoped>
.carTempCharts {
  height: 300px;
  margin-top: 20px;
}

h4 {
  font-size: 20px; /* h4 태그의 폰트 사이즈를 키움 */
}

.temperature-display {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; /* 온도를 나타내는 텍스트의 폰트 사이즈를 키움 */
}

.refresh-button {
  margin-left: 10px;
  display: flex; /* Flexbox를 사용하여 내용물을 중앙에 배치 */
  justify-content: center; /* 가로축 중앙 정렬 */
  align-items: center; /* 세로축 중앙 정렬 */
}
</style>