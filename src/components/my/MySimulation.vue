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
              {{
                simulatedIncentive
                  ? simulatedIncentive.incentive.toLocaleString()
                  : currentIncentive.toLocaleString()
              }}원
            </td>
          </tr>
          <tr>
            <th>예상 영업 순위</th>
            <td class="rank-cell">
              {{
                simulatedSalesRank ||
                (additionalSales === 0 ? currentSalesRank : "")
              }}
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
import { ref, defineProps, onMounted } from "vue";
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
const simulatedIncentive = ref(null);

// 시뮬레이션 결과의 영업 순위를 저장하기 위한 ref 변수
// 초기값은 빈 문자열로 설정
const simulatedSalesRank = ref("");

// 현재 인센티브 금액을 저장하기 위한 ref 변수
// 초기값은 0으로 설정
const currentIncentive = ref(0);

// 현재 영업 순위를 저장하기 위한 ref 변수
// 초기값은 빈 문자열로 설정
const currentSalesRank = ref("");

// 컴포넌트가 마운트될 때 실행되는 함수
onMounted(async () => {
  try {
    // 현재 년도와 월을 기준으로 모든 인센티브 정보를 조회
    const allIncentives = await axios.get("/incentive/list", {
      params: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    });
    const incentives = allIncentives.data;

    // 현재 인센티브 금액 계산 (현재 매출액의 1%)
    currentIncentive.value = Math.round(props.currentSales * 0.01);

    // 현재 영업 순위 계산
    // 현재 인센티브 금액보다 큰 인센티브를 가진 직원의 수 + 1
    const rank =
      incentives.filter(
        (incentive) => incentive.incentive > currentIncentive.value
      ).length + 1;

    // 순위가 3등 이내면 해당 순위를, 그 외에는 "4등 이하"로 표시
    currentSalesRank.value = rank <= 3 ? `${rank}등` : "4등 이하";
  } catch (error) {
    // 에러 발생 시 에러 메시지 출력
    console.error("현재 순위 조회 실패", error);
    currentSalesRank.value = "순위 정보 없음";
  }
});

// 인센티브 시뮬레이션을 조회하는 함수
const fetchIncentiveSimulation = async () => {
  try {
    // 인센티브 시뮬레이션 API 호출
    // 직원 코드, 현재 매출액, 추가 매출액을 파라미터로 전달
    const response = await axios.get("/incentive/simulation", {
      params: {
        empCode: props.empCode,
        currentSales: props.currentSales,
        additionalSales: additionalSales.value,
      },
    });

    // 시뮬레이션 결과를 simulatedIncentive에 저장
    simulatedIncentive.value = response.data;

    // 현재 년도와 월을 기준으로 모든 인센티브 정보를 조회
    const allIncentives = await axios.get("/incentive/list", {
      params: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    });
    const incentives = allIncentives.data;

    // 시뮬레이션 결과의 총 인센티브 금액 계산
    const totalIncentive = simulatedIncentive.value.incentive;

    // 시뮬레이션 결과의 영업 순위 계산
    // 총 인센티브 금액보다 큰 인센티브를 가진 직원의 수 + 1
    const rank =
      incentives.filter((incentive) => incentive.incentive > totalIncentive)
        .length + 1;

    // 순위가 3등 이내면 해당 순위를, 그 외에는 "4등 이하"로 표시
    simulatedSalesRank.value = rank <= 3 ? `${rank}등` : "4등 이하";
  } catch (error) {
    // 에러 발생 시 에러 메시지 출력
    console.error("인센티브 시뮬레이션 조회 실패", error);
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
