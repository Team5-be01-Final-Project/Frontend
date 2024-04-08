<template>
  <div class="incentive-simulation">
    <h3>인센티브 시뮬레이션</h3>
    <div class="simulation-section">
      <div class="sales-info">
        <table>
          <tr>
            <th>현재 매출액</th>
            <td class="amount-cell">{{ currentSales.toLocaleString() }}원</td>
          </tr>
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
        </table>
      </div>
      <div class="incentive-info">
        <table>
          <tr>
            <th>금월 인센티브 예상 금액</th>
            <td class="amount-cell">
              {{
                simulatedIncentive
                  ? simulatedIncentive.incentive.toLocaleString()
                  : "0"
              }}원
            </td>
          </tr>
          <tr>
            <th>영업 순위</th>
            <td>{{ salesRank || "순위 정보 없음" }}</td>
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
import { ref, defineProps } from "vue";
import axios from "axios";

// props를 정의하여 부모 컴포넌트로부터 empCode와 currentSales를 받습니다.
const props = defineProps({
  empCode: {
    type: Number, // empCode는 Number 타입입니다.
    required: true, // 필수 프로퍼티입니다.
  },
  currentSales: {
    type: Number, // currentSales 역시 Number 타입입니다.
    required: true, // 필수 프로퍼티입니다.
  },
});

// 추가 매출액을 저장할 반응형 변수입니다. 초기값은 0입니다.
const additionalSales = ref(0);
// 시뮬레이션으로 계산된 인센티브 정보를 저장할 반응형 변수입니다. 초기값은 null입니다.
const simulatedIncentive = ref(null);
// 계산된 영업 순위를 저장할 반응형 변수입니다. 초기값은 빈 문자열입니다.
const salesRank = ref("");

// 인센티브 시뮬레이션을 수행하는 함수입니다.
const fetchIncentiveSimulation = async () => {
  try {
    // 서버로부터 인센티브 정보를 조회합니다. empCode, currentSales, additionalSales를 파라미터로 전달합니다.
    const response = await axios.get("/incentive/simulation", {
      params: {
        empCode: props.empCode,
        currentSales: props.currentSales,
        additionalSales: additionalSales.value,
      },
    });
    // 조회한 인센티브 정보를 simulatedIncentive에 저장합니다.
    simulatedIncentive.value = response.data;

    // 모든 인센티브 정보를 조회하여, 전체에서의 순위를 계산합니다.
    const allIncentives = await axios.get("/incentive/list", {
      params: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    });
    // 조회한 인센티브 리스트입니다.
    const incentives = allIncentives.data;
    // 계산된 인센티브가 전체 인센티브 중에서 어디에 위치하는지를 계산합니다.
    const totalIncentive = simulatedIncentive.value.incentive;
    // 현재 인센티브가 높은 순으로 몇 등인지를 계산합니다.
    const rank =
      incentives.filter((incentive) => incentive.incentive > totalIncentive)
        .length + 1;
    // 계산된 순위를 salesRank에 저장합니다.
    salesRank.value = rank <= 3 ? `${rank}등` : "4등 이하";
  } catch (error) {
    // 오류가 발생한 경우, 콘솔에 오류 메시지를 출력합니다.
    console.error("인센티브 시뮬레이션 조회 실패", error);
  }
};
</script>

<style scoped>
.incentive-simulation {
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
  background-color: #007bff; /* 배경색 설정 */
  color: #fff; /* 글자색을 흰색으로 설정 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 테두리 둥글게 설정 */
  cursor: pointer; /* 커서를 포인터로 설정 */
}
</style>
