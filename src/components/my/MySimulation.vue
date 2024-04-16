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
              {{ currentIncentiveBase.toLocaleString() }}원 + {{ currentRankIncentive.toLocaleString() }}원({{ currentRankMessage }})
              <br>
              = {{ currentIncentive.toLocaleString() }}원
            </td>
          </tr>
          <tr>
            <th>현재 영업 순위</th>
            <td class="rank-cell">
              {{ currentSalesRank }}
            </td>
          </tr>
        </table>
      </div>
      <div class="incentive-info">
        <table>
          <tr>
            <th>추가 매출액</th>
            <td>
              <input
                type="number"
                v-model.number="additionalSales"
                class="additional-sales-input"
              />
            </td>
          </tr>
          <tr>
            <th>인센티브 예상 금액</th>
            <td class="amount-cell">
              {{ simulatedIncentiveBase.toLocaleString() }}원 + {{ simulatedRankIncentive.toLocaleString() }}원({{ simulatedRankMessage }})
              <br>
              = {{ simulatedIncentive.toLocaleString() }}원
            </td>
          </tr>
          <tr>
            <th>예상 영업 순위</th>
            <td class="rank-cell">
              {{ simulatedSalesRank }}
            </td>
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

    currentIncentiveBase.value = Math.round(props.currentSales * 0.01);
    updateCurrentRank();
    currentIncentive.value = currentIncentiveBase.value + currentRankIncentive.value;
  } catch (error) {
    console.error("인센티브 데이터 조회 실패", error);
    currentSalesRank.value = "순위 정보 없음";
  }
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
    currentRankIncentive.value = Math.round(props.currentSales * 0.005);
  } else if (rank === 2) {
    currentRankIncentive.value = Math.round(props.currentSales * 0.003);
  } else if (rank === 3) {
    currentRankIncentive.value = Math.round(props.currentSales * 0.001);
  } else {
    currentRankIncentive.value = 0;
  }
}

// 인센티브 시뮬레이션을 조회하는 함수
const fetchIncentiveSimulation = async () => {
  try {
    // 추가 매출액 반영하여 새로운 총 매출액 계산
    const newTotalSales = props.currentSales + additionalSales.value;
    // 새로운 인센티브 계산
    simulatedIncentiveBase.value = Math.round(newTotalSales * 0.01);

    // 모든 인센티브 정보를 조회
    const response = await axios.get("/incentive/list", {
      params: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    });

    // 랭크가 0이 아닌 인센티브 데이터만 필터링
    const validIncentives = response.data.filter(incentive => incentive.salesRank > 0);

    // 현재 사용자의 새로운 매출 데이터 추가
    validIncentives.push({ empCode: props.empCode, voucMonthSales: newTotalSales, incentive: simulatedIncentiveBase.value, salesRank: 0 });

    // 매출액 기준으로 내림차순 정렬
    validIncentives.sort((a, b) => b.voucMonthSales - a.voucMonthSales);

    // 새로운 매출액의 순위 계산
    const rank = validIncentives.findIndex(incentive => incentive.empCode === props.empCode) + 1;

    // 순위 업데이트
    simulatedSalesRank.value = rank === 0 ? "순위 정보 없음" : `${rank}등`;

    if (rank === 1) {
      simulatedRankIncentive.value = Math.round(newTotalSales * 0.005);
    } else if (rank === 2) {
      simulatedRankIncentive.value = Math.round(newTotalSales * 0.003);
    } else if (rank === 3) {
      simulatedRankIncentive.value = Math.round(newTotalSales * 0.001);
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
  margin-top: 20px; /* 위에 공간 추가 */
  padding: 20px; /* 내부 패딩 설정 */
  background-color: #f5f5f5; /* 배경색 설정 */
  border-radius: 4px; /* 테두리 둥글게 설정 */
}

.simulation-section {
  display: flex; /* 플렉스박스로 설정하여 내부 항목을 가로로 배치 */
  justify-content: space-between; /* 내부 항목을 양쪽으로 분산 배치 */
}

.sales-info,
.incentive-info {
  display: flex; /* 플렉스박스로 설정 */
  flex-direction: column; /* 항목을 세로로 배치 */
}

.sales-info table,
.incentive-info table {
  width: 100%; /* 테이블의 너비를 부모 요소의 100%로 설정 */
  border-collapse: collapse; /* 테이블의 테두리를 겹쳐서 표시 */
}

.sales-info th,
.incentive-info th {
  font-weight: bold; /* 제목 셀의 글꼴을 굵게 설정 */
  text-align: left; /* 텍스트를 왼쪽 정렬 */
  padding: 8px; /* 패딩 설정 */
}

.sales-info td,
.incentive-info td {
  padding: 8px; /* 패딩 설정 */
}

.amount-cell {
  text-align: right; /* 금액 셀의 텍스트를 오른쪽 정렬 */
}

.additional-sales-input {
  -moz-appearance: textfield; /* 파이어폭스에서 입력 필드의 외형을 텍스트 필드로 설정 */
  text-align: right; /* 텍스트를 오른쪽 정렬 */
  width: 100%; /* 입력 필드의 너비를 부모 요소의 100%로 설정 */
}

.additional-sales-input::-webkit-outer-spin-button,
.additional-sales-input::-webkit-inner-spin-button {
  -webkit-appearance: none; /* 크롬에서 입력 필드 내의 스피너를 제거 */
  margin: 0; /* 마진 제거 */
}

.calculate-button {
  display: block; /* 블록 레벨 요소로 설정하여 단독 줄 사용 */
  margin: 20px auto 0; /* 상단에 마진을 주고 좌우를 자동으로 설정하여 중앙 정렬 */
  padding: 10px 20px; /* 패딩 설정 */
  background-color: #154EC1; /* 배경색 설정 */
  color: #fff; /* 글자색을 흰색으로 설정 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 테두리 둥글게 설정 */
  cursor: pointer; /* 커서를 포인터로 설정 */
}

h3 {
  font-size: 20px;
  /* h4 태그의 폰트 사이즈를 키움 */
}

.rank-cell {
  text-align: right; /* 순위 셀의 텍스트를 오른쪽 정렬 */
}
</style>