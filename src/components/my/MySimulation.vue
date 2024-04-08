<!-- MySimulation.vue -->
<template>
  <div class="incentive-simulation">
    <h3>인센티브 시뮬레이션</h3>
    <div class="simulation-section">
      <div class="sales-info">
        <div class="current-sales">
          <p>현재 매출액 : {{ currentSales.toLocaleString() }}원</p>
        </div>
        <div class="additional-sales">
          <label for="additionalSales">추가 매출액 : </label>
          <input
            type="number"
            id="additionalSales"
            v-model.number="additionalSales"
            class="additional-sales-input"
          />
        </div>
      </div>
      <div class="incentive-info">
        <p>
          금월 인센티브 예상 금액 :
          {{
            simulatedIncentive
              ? simulatedIncentive.incentive.toLocaleString()
              : "0"
          }}원
        </p>
        <p>영업 순위 : {{ salesRank || "순위 정보 없음" }}</p>
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

// props를 통해 부모 컴포넌트로부터 empCode와 currentSales 값을 받습니다.
const props = defineProps({
  empCode: {
    type: Number,
    required: true, // 필수 prop임을 명시
  },
  currentSales: {
    type: Number,
    required: true, // 필수 prop임을 명시
  },
});

// 추가 매출액, 시뮬레이션 결과, 영업 순위를 저장할 반응형 참조
const additionalSales = ref(0); // 초기 추가 매출액은 0
const simulatedIncentive = ref(null); // 시뮬레이션 결과를 담을 변수, 초기값은 null
const salesRank = ref(""); // 영업 순위를 저장할 변수, 초기값은 빈 문자열

// 인센티브 시뮬레이션을 수행하는 함수
const fetchIncentiveSimulation = async () => {
  try {
    // 인센티브 계산을 위한 API 요청
    const response = await axios.get("/incentive/simulation", {
      params: {
        empCode: props.empCode,
        currentSales: props.currentSales,
        additionalSales: additionalSales.value,
      },
    });
    simulatedIncentive.value = response.data; // 시뮬레이션 결과 저장

    // 모든 인센티브 데이터를 가져와서 순위 계산
    const allIncentives = await axios.get("/incentive/list", {
      params: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
    });
    const incentives = allIncentives.data; // 전체 인센티브 데이터
    // 현재 시뮬레이션 결과 기준으로 순위 계산
    const totalIncentive = simulatedIncentive.value.incentive;
    const rank =
      incentives.filter((incentive) => incentive.incentive > totalIncentive)
        .length + 1;
    salesRank.value = rank <= 3 ? `${rank}등` : "4등 이하"; // 순위 설정
  } catch (error) {
    console.error("인센티브 시뮬레이션 조회 실패", error);
  }
};
</script>
  
  
<style scoped>
/* 인센티브 시뮬레이션 컨테이너 스타일링 */
.incentive-simulation {
  padding: 20px; /* 내부 여백 */
  background-color: #f5f5f5; /* 배경색 */
  border-radius: 4px; /* 모서리 둥글게 */
}

/* 시뮬레이션 섹션 스타일링 */
.simulation-section {
  display: flex; /* 가로로 배치 */
  justify-content: space-between; /* 요소들 사이의 공간 균등 배분 */
}

/* 매출 정보 및 인센티브 정보 스타일링 */
.sales-info,
.incentive-info {
  display: flex; /* flexbox 사용 */
  flex-direction: column; /* 세로 방향으로 요소들을 배치 */
}

/* 현재 매출액, 추가 매출액, 인센티브 정보의 텍스트 스타일링 */
.current-sales,
.additional-sales,
.incentive-info {
  font-size: 16px; /* 글자 크기 */
  font-weight: bold; /* 글자 굵기 */
  margin-right: 15px; /* 오른쪽 여백 */
}

/* 추가 매출액 입력 필드 스타일링 */
.additional-sales-input {
  -moz-appearance: textfield; /* Firefox에서 스피너 제거 */
  text-align: right; /* 텍스트 오른쪽 정렬 */
}

/* Chrome에서 스피너 제거 */
.additional-sales-input::-webkit-outer-spin-button,
.additional-sales-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 계산하기 버튼 스타일링 */
.calculate-button {
  display: block; /* 블록 레벨 요소로 설정 */
  margin: 20px auto 0; /* 위에 여백, 가운데 정렬 */
  padding: 10px 20px; /* 내부 여백 */
  background-color: #007bff; /* 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 모서리 둥글게 */
  cursor: pointer; /* 클릭 가능한 커서 모양 */
}

/* 인센티브 정보 섹션 스타일링 */
.incentive-info {
  margin-left: 20px; /* 왼쪽 여백 */
  background-color: #e9ecef; /* 배경색 */
  padding: 10px; /* 내부 여백 */
  border-radius: 4px; /* 모서리 둥글게 */
}
</style>
