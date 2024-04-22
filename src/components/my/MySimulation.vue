<!-- MySimulation.vue -->
<template>
  <h3>인센티브 시뮬레이션</h3>
  <div class="incentive-simulation">
    <div class="simulation-section">
      <div class="sales-info">
        <table>
          <tr>
            <th>현재 매출액</th>
            <td class="amount-cell">{{ currentSales.toLocaleString() }}원</td>
          </tr>
          <tr>
            <th>금월 인센티브 금액</th>
            <td class="amount-cell">
              {{ currentIncentive.toLocaleString() }}원
            </td>
          </tr>
          <tr>
            <th>현재 영업 순위</th>
            <td class="rank-cell">{{ currentSalesRank }}</td>
          </tr>
        </table>
      </div>
      <div class="incentive-info">
        <table>
          <tr>
            <th>추가 매출액</th>
            <td>
              <input
                id="currency-input"
                type="text"
                v-model="additionalSales"
                class="additional-sales-input"
              />
            </td>
          </tr>
          <tr>
            <th>인센티브 예상 금액</th>
            <td class="amount-cell">
              {{ simulatedIncentive.toLocaleString() }}원
            </td>
          </tr>
          <tr>
            <th>예상 영업 순위</th>
            <td class="rank-cell">{{ simulatedSalesRank }}</td>
          </tr>
        </table>
      </div>
    </div>
    <button @click="fetchIncentiveSimulation" class="calculate-button">
      계산하기
    </button>
  </div>
</template>

<script setup>
  import { ref, defineProps, onMounted, computed } from "vue";
  import axios from "axios";
  import AutoNumeric from 'autonumeric';
  
  // 부모 컴포넌트에서 전달받은 props 정의
  // empCode: 직원 코드 (필수)
  // currentSales: 현재 매출액 (필수)
  const props = defineProps({
    empCode: {
      type: Number,
      required: true,
    },
    currentSales: {
      type: Number,
      required: true,
    },
  });
  
  // 추가 매출액을 입력받기 위한 ref 변수
  // 초기값은 0으로 설정
  const additionalSales = ref(0);
  
  // 시뮬레이션 결과를 저장하기 위한 ref 변수
  // 초기값은 null로 설정
  const simulatedIncentive = ref(0);
  
  // 시뮬레이션 결과의 영업 순위를 저장하기 위한 ref 변수
  // 초기값은 빈 문자열로 설정
  const simulatedSalesRank = ref("");
  
  // 현재 인센티브 금액을 저장하기 위한 ref 변수
  // 초기값은 0으로 설정
  const currentIncentive = ref(0);
  
  // 현재 영업 순위를 저장하기 위한 ref 변수
  // 초기값은 빈 문자열로 설정
  const currentSalesRank = ref("");
  
  const incentivesData = ref([]); // 전체 인센티브 데이터 저장
  
  const currentIncentiveBase = ref(0);
  const currentRankIncentive = ref(0);
  
  const simulatedIncentiveBase = ref(0);
  const simulatedRankIncentive = ref(0);
  
  const currentRankMessage = computed(() => {
    const rank = parseInt(currentSalesRank.value);
    if (rank === 1) {
      return "1순위 가중치";
    } else if (rank === 2) {
      return "2순위 가중치";
    } else if (rank === 3) {
      return "3순위 가중치";
    }
    return "";
  });
  
  const simulatedRankMessage = computed(() => {
    const rank = parseInt(simulatedSalesRank.value);
    if (rank === 1) {
      return "1순위 가중치";
    } else if (rank === 2) {
      return "2순위 가중치";
    } else if (rank === 3) {
      return "3순위 가중치";
    }
    return "";
  });
  
  // 컴포넌트가 마운트될 때 실행되는 함수
  onMounted(async () => {
    try {
      const response = await axios.get("/incentive/list", {
        params: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      });
      incentivesData.value = response.data;
  
      currentIncentiveBase.value = Math.round(props.currentSales * 0.1);
      updateCurrentRank();
      currentIncentive.value = currentIncentiveBase.value + currentRankIncentive.value;
    } catch (error) {
      console.error("인센티브 데이터 조회 실패", error);
      currentSalesRank.value = "순위 정보 없음";
    }
  
    // 입력 필드에 autoNumeric을 적용
    new AutoNumeric('#currency-input', {
        digitGroupSeparator: ',',    // 천 단위 구분자로 콤마 사용
        decimalPlaces: 0  // 소수점 이하 두 자리까지 표시
    });
  });
  
  const filteredIncentives = computed(() => {
    return incentivesData.value.filter(incentive => incentive.salesRank > 0);
  });
  
  function updateCurrentRank() {
    const sortedIncentives = filteredIncentives.value.sort(
      (a, b) => b.voucMonthSales - a.voucMonthSales
    );
    const rank = sortedIncentives.findIndex(
      incentive => incentive.voucMonthSales === props.currentSales
    ) + 1;
    currentSalesRank.value = `${rank}등`;
  
    if (rank === 1) {
      currentRankIncentive.value = Math.round(props.currentSales * 0.05);
    } else if (rank === 2) {
      currentRankIncentive.value = Math.round(props.currentSales * 0.03);
    } else if (rank === 3) {
      currentRankIncentive.value = Math.round(props.currentSales * 0.01);
    } else {
      currentRankIncentive.value = 0;
    }
  }
  
  // 숫자로 변환하는 함수 추가
  function parseCurrencyToNumber(currencyString) {
    return Number(currencyString.replace(/,/g, '')); // 콤마 제거 후 숫자로 변환
  }
  
  // 인센티브 시뮬레이션을 조회하는 함수
  const fetchIncentiveSimulation = async () => {
    console.log(additionalSales.value)
    try {
      // 추가 매출액 반영하여 새로운 총 매출액 계산
      const newTotalSales = props.currentSales + parseCurrencyToNumber(additionalSales.value);
      // 새로운 인센티브 계산
      simulatedIncentiveBase.value = Math.round(newTotalSales * 0.1);
  
      // 모든 인센티브 정보를 조회
      const response = await axios.get("/incentive/list", {
        params: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      });
  
      // 랭크가 0이 아닌 인센티브 데이터만 필터링
      const validIncentives = response.data.filter(incentive => incentive.salesRank > 0);
  
      // 새로운 총 매출액이 포함된 인센티브 데이터 생성
      const newIncentive = {
        empCode: props.empCode,
        voucMonthSales: newTotalSales,
        incentive: simulatedIncentiveBase.value,
      };
  
      // 새로운 총 매출액을 기준으로 순위 계산
      let rank = 1;
      for (const incentive of validIncentives) {
        if (incentive.voucMonthSales > newTotalSales) {
          rank++;
        } else if (incentive.voucMonthSales === newTotalSales && incentive.empCode < props.empCode) {
          rank++;
        }
      }
  
      // 순위 업데이트
      simulatedSalesRank.value = `${rank}등`;
  
      if (rank === 1) {
        simulatedRankIncentive.value = Math.round(newTotalSales * 0.05);
      } else if (rank === 2) {
        simulatedRankIncentive.value = Math.round(newTotalSales * 0.03);
      } else if (rank === 3) {
        simulatedRankIncentive.value = Math.round(newTotalSales * 0.01);
      } else {
        simulatedRankIncentive.value = 0;
      }
  
      simulatedIncentive.value = simulatedIncentiveBase.value + simulatedRankIncentive.value;
    } catch (error) {
      console.error("인센티브 시뮬레이션 조회 실패", error);
      simulatedSalesRank.value = "순위 정보 없음";
    }
  };
</script>

<style scoped>
.incentive-simulation {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.simulation-section {
  display: flex;
  justify-content: space-between;
}

.sales-info,
.incentive-info {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 0 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sales-info table,
.incentive-info table {
  width: 100%;
  border-collapse: collapse;
}

.sales-info th,
.incentive-info th {
  font-weight: bold;
  text-align: left;
  /* padding: 12px; */
  color: #333;
}

.sales-info td,
.incentive-info td {
  /* padding: 12px; */
}

.amount-cell {
  text-align: right;
  font-weight: bold;
  color: #154EC1;
}

th,
td {
  height: 40px; /* 원하는 높이로 조정 */
  line-height: 40px; /* 높이와 같은 값으로 설정 */
  vertical-align: middle; /* 수직 가운데 정렬 */
}

.additional-sales-input {
  -moz-appearance: textfield;
  width: 100px; /* 원하는 너비로 조정 */
  height: 30px; /* th, td 높이보다 작은 값 */
  float: right;
  padding: 0 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  line-height: 30px; /* 높이와 동일한 값 */
  text-align: right;
  box-sizing: border-box; /* 패딩과 보더를 포함한 크기로 설정 */
}

.additional-sales-input::-webkit-outer-spin-button,
.additional-sales-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.calculate-button {
  display: block;
  margin: 20px auto 0;
  padding: 12px 24px;
  background-color: #154EC1;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.calculate-button:hover {
  background-color: #1a3a8e;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.rank-cell {
  text-align: right;
  font-weight: bold;
}
</style> 