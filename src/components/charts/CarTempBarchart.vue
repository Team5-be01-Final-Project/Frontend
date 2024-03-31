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
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(data), // 차량 코드를 라벨로 사용
                    datasets: [{
                        label: '온도 (°C)',
                        data: Object.values(data),
                        backgroundColor: Object.values(data).map(temp => (temp < 2 || temp > 8) ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)'),
                        borderColor: Object.values(data).map(temp => (temp < 2 || temp > 8) ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'),
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
                            min: -5, // y축의 최소값 설정
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
