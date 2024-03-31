<template>
    <div>
        <div style="display: flex; align-items: center;">
            <canvas id="carTempChart"></canvas>
            <button @click="fetchData" style="margin-left: 10px;">
                <i class="fas fa-sync-alt"></i> 새로고침
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.css';
Chart.register(...registerables);

export default {
    name: 'CarTempBarchart',
    data() {
        return {
            chart: null, // 차트 인스턴스를 저장하기 위한 데이터 속성
        };
    },
    mounted() {
        this.fetchData(); // 컴포넌트가 마운트될 때 데이터를 한 번 가져옵니다.
    },
    methods: {
        async fetchData() {
            const response = await axios.get('/temp-logs');
            this.renderChart(response.data);
        },
        renderChart(data) {
            const ctx = document.getElementById('carTempChart').getContext('2d');
            if (this.chart) {
                this.chart.destroy(); // 기존 차트가 있으면 삭제
            }

            // SRG10을 제외하고 storageCode를 숫자 부분에 따라 정렬
            const sortedKeys = Object.keys(data)
                .filter(key => key !== 'SRG10') // SRG10 제외
                .sort((a, b) => parseInt(a.substring(3)) - parseInt(b.substring(3)));

            // 정렬된 키에 따라 온도 값도 정렬
            const sortedTemps = sortedKeys.map(key => data[key]);

            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedKeys, // 정렬된 차량 코드를 라벨로 사용
                    datasets: [{
                        label: '온도 (°C)',
                        data: sortedTemps,
                        backgroundColor: sortedTemps.map(temp => (temp < 2 || temp > 8) ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)'),
                        borderColor: sortedTemps.map(temp => (temp < 2 || temp > 8) ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // 반응형 설정
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: 0, // y축의 최소값 설정
                            max: 10, // y축의 최대값 설정
                            ticks: {
                                stepSize: 2 // y축의 간격 설정
                            }
                        }
                    }
                }
            });
        }
    }
};
</script>
