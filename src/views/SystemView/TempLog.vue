<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SystemSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">창고/차량 이상온도 조회</h3>
      <div class="filter">
        <va-select
          v-model="selectedYear"
          :options="yearOptions"
          placeholder="년도 선택"
          style="margin-right: 5px"
        />
        <va-select
          v-model="selectedMonth"
          :options="monthOptions"
          placeholder="월 선택"
          style="margin-right: 5px"
        />
        <VaSelect
          v-model="selectedSearchCondition"
          placeholder="검색 조건"
          :options="[
            { text: '전체', value: '' },
            { text: '구분', value: 'storageSeg' },
            { text: '차량번호', value: 'storageCar' },
          ]"
          value-by="value"
          style="margin-right: 5px"
        />
        <VaInput
          v-model="searchText"
          placeholder="검색어 입력"
          class="w-full"
          style="margin-right: 5px"
        />
        <va-button @click="applyFilter">검색</va-button>
      </div>
      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th>이상온도코드</th>
            <th>구분</th>
            <th>차량번호</th>
            <th>이상온도</th>
            <th>시간</th>
            <th>담당자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="item.tempCode">
            <td style="text-align: center">{{ item.tempCode }}</td>
            <td style="text-align: center">{{ item.storageSeg }}</td>
            <td style="text-align: center">{{ item.storageCar }}</td>
            <td style="text-align: center">{{ item.tempTemp }}</td>
            <td style="text-align: center">{{ item.tempDate }}</td>
            <td style="text-align: center">{{ item.empName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SystemSidebar from "@/components/sidebar/SystemSidebar.vue";
import { yearOptions } from "@/utils/yearOptions";
import { monthOptions } from "@/utils/monthOptions";
import { ref, onMounted } from "vue";

export default {
  components: {
    SystemSidebar,
  },
  setup() {
    const currentYear = new Date().getFullYear(); // 현재 년도
    const currentMonth = new Date().getMonth() + 1; // 현재 월, 두 자리로 포맷팅

    const filteredData = ref([]);
    const allData = ref([]);
    const selectedYear = ref(
      yearOptions.find((option) => option.value === currentYear)
    ); // 현재 년도를 기본값으로 설정
    const selectedMonth = ref(
      monthOptions.find((option) => option.value === currentMonth)
    );
    const selectedSearchCondition = ref(null);
    const searchText = ref("");

    const fetchTempLogs = async () => {
      try {
        const response = await axios.get(`/temp-logs/all`);
        allData.value = response.data; // 원본 데이터 저장
        filteredData.value = response.data; // 초기에는 모든 데이터 표시

        // 데이터 로딩 후 필터링 적용
        applyFilter(); // 이 부분을 추가
      } catch (error) {
        console.error(
          "이상 온도 로그 데이터를 가져오는 중 에러가 발생했습니다.",
          error
        );
      }
    };

    const applyFilter = () => {
      filteredData.value = allData.value.filter((item) => {
        const dateParts = item.tempDate.split("-");
        const yearMatch = selectedYear.value
          ? dateParts[0] === String(selectedYear.value.value)
          : true;
        const monthMatch = selectedMonth.value
          ? dateParts[1] === String(selectedMonth.value.value).padStart(2, "0")
          : true;

        let conditionMatch = true;

        // 검색 조건이 "전체"가 아니며, 검색 텍스트가 입력된 경우
        if (selectedSearchCondition.value && searchText.value) {
          const itemValue = item[selectedSearchCondition.value]
            ?.toString()
            .toLowerCase();
          conditionMatch = itemValue.includes(searchText.value.toLowerCase());
        }

        // 모든 조건이 true인 경우에만 해당 아이템을 필터링 결과에 포함
        return yearMatch && monthMatch && conditionMatch;
      });
    };

    onMounted(fetchTempLogs);

    return {
      filteredData,
      selectedYear,
      selectedMonth,
      selectedSearchCondition,
      searchText,
      yearOptions,
      monthOptions,
      applyFilter,
    };
  },
};
</script>


<style>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바의 너비를 조절하세요 */
  /* 필요에 따라 추가 스타일링 */
}

.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}

.filter {
  margin-bottom: 25px;
}
</style>