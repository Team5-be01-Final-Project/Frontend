<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <BusinessSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">인센티브 현황</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <va-select
          v-model="selectedDepartment"
          placeholder="부서 선택"
          :options="deptOption"
          :disabled="isDeptSelectDisabled" style="margin-right: 5px;"
        />
        <va-select
          v-model="selectedYear"
          placeholder="연도 선택"
          :options="yearOption" style="margin-right: 5px;"
        />
        <va-select
          v-model="selectedMonth"
          placeholder="월 선택"
          :options="monthOption" style="margin-right: 5px;"
        />
        <VaButton @click="applyFilter">검색</VaButton>
      </div>

      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th>직원 이름</th>
            <th>부서</th>
            <th>월 매출액</th>
            <th>판매 순위</th>
            <th>인센티브</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="item.empName">
            <td>{{ item.empName }}</td>
            <td>{{ item.deptName }}</td>
            <td class="money-right">
              {{ formatNumberWithCommas(item.voucMonthSales) }}
            </td>
            <td>{{ item.salesRank }}</td>
            <td class="money-right">
              {{ formatNumberWithCommas(item.incentive) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script>
import axios from "axios";
import { departmentOptions } from "@/utils/departmentOptions.js";
import { yearOptions } from "@/utils/yearOptions.js";
import { monthOptions } from "@/utils/monthOptions.js";
import formatNumberWithCommas from "@/utils/formatNumberWithCommas.js";
import BusinessSidebar from "@/components/sidebar/BusinessSidebar.vue";
import Cookies from "js-cookie";

export default {
  components: {
    BusinessSidebar,
  },
  data() {
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1; // getMonth()는 0에서 시작하므로 +1
    const defaultYearOption = yearOptions.find(
      (option) => option.value === new Date().getFullYear()
    );
    const defaultMonthOption = monthOptions.find(
      (option) => option.value === new Date().getMonth() + 1
    );

    return {
      incentives: [],
      selectedDepartment: "",
      deptOption: departmentOptions,
      selectedYear: defaultYearOption,
      selectedYearhistory: defaultYearOption,
      yearOption: yearOptions,
      selectedMonth: defaultMonthOption,
      selectedMonthhistory: defaultMonthOption,
      monthOption: monthOptions,
      filteredData: [], // 필터링된 데이터를 저장할 배열
      isDeptSelectDisabled: false,
    };
  },
  created() {
    this.userAuthCode = Cookies.get("empAuthCode");
    this.userDeptCode = Cookies.get("deptCode");

    if (this.userAuthCode === "AUTH003") {
      const userDept = this.deptOption.find(
        (dept) => dept.value === this.userDeptCode
      );
      if (userDept) {
        this.selectedDepartment = userDept;
      }
      // 부서 선택 컴포넌트를 비활성화합니다.
      this.isDeptSelectDisabled = true;
    }
  },
  mounted() {
    this.fetchIncentives(this.selectedYear, this.selectedMonth).then(() => {
      this.applyFilter();
    });
  },
  methods: {
    formatNumberWithCommas,
    async fetchIncentives(year, month) {
      try {
        const response = await axios.get(
          `/incentive/list?year=${year.value}&month=${month.value}`
        );
        this.incentives = response.data;
        this.filteredData = response.data; // 초기 상태에서는 모든 데이터를 표시
      } catch (error) {
        console.error(
          "인센티브 데이터를 가져오는 중 에러가 발생했습니다.",
          error
        );
      }
      this.selectedYearhistory = this.selectedYear;
      this.selectedMonthhistory = this.selectedMonth; // 비동기 호출이 성공한 후 업데이트
    },
    async applyFilter() {
      // 연도나 월 변경 시 데이터 다시 가져오기
      const yearChanged = this.selectedYear !== this.selectedYearhistory;
      const monthChanged = this.selectedMonth !== this.selectedMonthhistory;

      if (yearChanged || monthChanged) {
        // console.log(this.selectedYear);
        await this.fetchIncentives(this.selectedYear, this.selectedMonth);
      }

      this.fetchFilterDept();
    },

    fetchFilterDept() {
      if (!this.selectedDepartment || this.selectedDepartment.value === "") {
        this.filteredData = this.incentives;
      } else {
        this.filteredData = this.incentives.filter(
          (item) => item.deptName === this.selectedDepartment.text
        );
      }
    },
  },
};
</script>
  
  <style>
.flex {
  display: flex;
}

.sidebar {
  width: 250px; /* 사이드바의 너비를 조절하세요 */
  /* 필요에 따라 추가 스타일링 */
}

.pagination {
  margin-top: 20px;
}
.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

td.money-right {
  text-align: right;
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
</style>