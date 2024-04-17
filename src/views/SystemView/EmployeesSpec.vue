<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SystemSidebar />
    </div>

    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">사원 정보 조회</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end" style="margin-bottom: 25px">
          <VaSelect v-model="selectedDept" placeholder="부서" :options="deptOptions" style="margin-right: 5px" />
          <VaSelect v-model="selectedSearchCondition" placeholder="검색 조건" :options="[
            { text: '이름', value: 'empName' },
            { text: '이메일', value: 'empEmail' },
          ]" value-by="value" style="margin-right: 5px" />
          <VaInput v-model="searchText" :disabled="!selectedSearchCondition" placeholder="검색어 입력" class="w-full" style="margin-right: 5px" />
          <VaButton @click="fetchFilteredEmployees">검색</VaButton>
          <refresh-button class="left-margin" />
        </div>

        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <th>사번</th>
              <th>이름</th>
              <th>직급</th>
              <th>부서</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>입사일</th>
              <th>퇴사일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.empCode">
              <td style="text-align: center">{{ employee.empCode }}</td>
              <td style="text-align: center"> <img :src="employee.empImg" alt="Employee Image"
                  class="employee-image" /><br>{{ employee.empName }}</td>
              <td style="text-align: center">{{ employee.posName }}</td>
              <td style="text-align: center">{{ employee.deptName }}</td>
              <td>{{ employee.empTel }}</td>
              <td style="text-align: center">{{ employee.empEmail }}</td>
              <td style="text-align: center">{{ employee.empStartDate }}</td>
              <td style="text-align: center">{{ employee.empEndDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VaButton } from "vuestic-ui/web-components";
import SystemSidebar from "@/components/sidebar/SystemSidebar.vue";
import { departmentOptions } from "@/utils/departmentOptions.js";
import RefreshButton from "@/components/RefreshButton.vue";

export default {
  components: {
    SystemSidebar,
    RefreshButton,
  },
  data() {
    return {
      deptOptions: departmentOptions,
      originemployees: [],
      employees: [],
      loading: true,
      selectedDept: null, // 부서 선택을 위한 변수
      selectedSearchCondition: null, // 검색 조건 선택을 위한 변수
      searchText: "", // 검색어 입력을 위한 변수
    };
  },

  computed: {
    SystemSidebar,
  },

  created() {
    this.fetchEmployeesList();
  },

  methods: {
    async fetchFilteredEmployees() {
      let filteredEmployees = [...this.originemployees]; // 복사본을 사용하여 필터링합니다.

      if (this.selectedDept) {
        filteredEmployees = filteredEmployees.filter(
          (employee) =>
            this.selectedDept.text === "전체" ||
            employee.deptName === this.selectedDept.text
        );
      }

      if (this.searchText && this.selectedSearchCondition) {
        filteredEmployees = filteredEmployees.filter((employee) =>
          employee[this.selectedSearchCondition]
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
      }

      // 필터링된 결과로 employees 배열을 업데이트합니다.
      this.employees = filteredEmployees;
    },

    async fetchEmployeesList() {
      try {
        const response = await axios.get(`/employees/specs`);
        this.originemployees = response.data;
        this.employees = [...this.originemployees];
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바의 너비를 조절하세요 */
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

.employee-image {
  width: 50px;
  /* 이미지의 너비 */
  height: 50px;
  /* 이미지의 높이 */
  border-radius: 50%;
  /* 이미지를 원형으로 표시 */
  object-fit: cover;
  /* 이미지 비율 유지 */
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

th,

td {
  vertical-align: middle;
  /* 값들 중간 정렬 */
}

.va-table thead th {
  background-color: #DEE5F2;
  /* 짙은 파란색 배경 */
  font-weight: bold;
  /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc;
  /* 회색 테두리 */
  font-size: 15px;
}

.left-margin{
  margin-left: 5px;
}
</style>