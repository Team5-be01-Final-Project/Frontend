<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SystemSidebar />
    </div>

    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">사원 정보 수정</h3>
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"
          style="margin-bottom: 25px"
        >
          <VaSelect
            v-model="selectedDept"
            placeholder="부서"
            :options="deptOptions"
            style="margin-right: 5px"
          />
          <VaSelect
            v-model="selectedSearchCondition"
            placeholder="검색 조건"
            :options="[
              { text: '이름', value: 'empName' },
              { text: '이메일', value: 'empEmail' },
            ]"
            value-by="value"
            style="margin-right: 5px"
          />
          <VaInput
            v-model="searchText"
            :disabled="!selectedSearchCondition"
            placeholder="검색어 입력"
            class="w-full"
            style="margin-right: 5px"
          />
          <VaButton @click="fetchFilteredEmployees">검색</VaButton>
          <refresh-button class="left-margin"/>
        </div>
        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <th>사번</th>
              <th>이름</th>
              <th>직급</th>
              <th>부서</th>
              <th>이메일</th>
              <th>권한</th>
              <th>알림설정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.empCode">
              <td style="text-align: center">{{ employee.empCode }}</td>
              <td style="text-align: center">{{ employee.empName }}</td>
              <td style="text-align: center">{{ employee.posName }}</td>
              <td style="text-align: center">{{ employee.deptName }}</td>
              <td>{{ employee.empEmail }}</td>
              <td style="text-align: center">
                <va-select
                  v-model="employee.selectedAuthorityCode"
                  placeholder="권한 선택"
                  :options="authorityCodeOptions"
                  @update:modelValue="authorityChange(employee)"
                />
              </td>
              <td style="text-align: center">
                <VaButton @click="openAlarmSettingsModal(employee)"
                  >알림 설정</VaButton
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <VaModal
    v-model="isAuthorityChangeModalOpen"
    title="권한 변경 확인"
    @ok="AuthorityChangeModalproceedChange"
    ok-text="변경"
    @cancel="AuthorityChangeModalcancelChange"
    cancel-text="취소"
  >
    <h4>권한을 변경 하시겠습니까?</h4>
  </VaModal>

  <VaModal
    v-model="isAlarmSettingsModalOpen"
    ok-text="저장"
    cancel-text="취소"
    @ok="saveAlarmSettings"
  >
    <template #header>
      <h4>알림 설정 변경</h4>
    </template>
    <br>

    <div class="flex flex-col">
      <div v-for="(value, code) in alarmSettings" :key="code" class="mb-6">
        <VaCheckbox
          :value="code"
          v-model="alarmSettings[code]"
          :label="alarmNames[code]"
        />
      </div>
    </div>
  </VaModal>
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
      employees: [],
      loading: true,
      // currentPage: 1,
      selectedDept: "", // 부서 선택을 위한 변수
      selectedSearchCondition: null, // 검색 조건 선택을 위한 변수
      searchText: "", // 검색어 입력을 위한 변수
      employee: {
        originalAuthorityCode: null,
        selectedAuthorityCode: null,
      },
      authorityCodes: [],
      changingEmployee: null, // 권한 변경할 직원 정보 저장
      isAlarmSettingsModalOpen: false,
      alarmSettings: {
        AL01: false, // 이상 온도 알림
        // 'AL02': false, // 이상 압력 알림
      },
      alarmNames: {
        AL01: '이상 온도 알림',
        // AL02: '다른 알람 이름'
      },
    };
  },

  computed: {
    SystemSidebar,
    authorityCodeOptions() {
      return this.authorityCodes.map((code) => ({
        text: code.authName, // 사용자에게 보여질 텍스트
        value: code.authCode, // 실제 선택 시 반환될 값
      }));
    },
  },

  created() {
    this.fetchAuthorityCodes().then(() => {
      this.fetchEmployeesList();
    });
  },

  methods: {
    async fetchFilteredEmployees() {
      try {
        const params = new URLSearchParams();
        if (this.selectedDept) {
          if (this.selectedDept.text === "전체") {
            params.append("deptName", this.selectedDept.value);
          } else {
            params.append("deptName", this.selectedDept.text);
          }
        }
        if (this.searchText && this.selectedSearchCondition) {
          params.append(this.selectedSearchCondition, this.searchText);
        }
        const response = await axios.get(`employees/list?${params.toString()}`);
        this.employees = response.data;
        this.employees = response.data.map((employee) => ({
          ...employee,
          // 백엔드로부터 받은 권한 코드를 selectedAuthorityCode에 설정,
          selectedAuthorityCode: {
            text: employee.authName,
            value: employee.authCode,
          },
        }));
      } catch (error) {
        console.error("필터링된 데이터 가져오기 실패:", error);
      }
    },
    async fetchEmployeesList() {
      try {
        const response = await axios.get(`/employees/list?`);
        this.employees = response.data; // 응답 데이터 할당
        this.employees = response.data.map((employee) => ({
          ...employee,
          // 백엔드로부터 받은 권한 코드를 selectedAuthorityCode에 설정
          selectedAuthorityCode: {
            text: employee.authName,
            value: employee.authCode,
          },
        }));
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAuthorityCodes() {
      try {
        const response = await axios.get("/authorities/codes");
        this.authorityCodes = response.data.map((item) => ({
          authName: item.authName,
          authCode: item.authCode,
        }));
      } catch (error) {
        console.error("권한 코드 가져오기 실패:", error);
      }
    },

    authorityChange(employee) {
      console.log("authorityChange called", employee);
      this.changingEmployee = employee; // 변경할 직원 정보 저장
      this.isAuthorityChangeModalOpen = true; // 모달 열기
    },

    async AuthorityChangeModalproceedChange() {
      if (this.changingEmployee) {
        try {
          await this.updateEmployeeAuthority(this.changingEmployee);
          this.fetchFilteredEmployees(); // 변경 사항 반영을 위해 직원 목록 새로고침
        } catch (error) {
          console.error("권한 변경 처리 실패:", error);
        }
      }
      this.isAuthorityChangeModalOpen = false; // 모달 닫기
    },

    AuthorityChangeModalcancelChange() {
      this.fetchFilteredEmployees(); // 변경 사항 반영을 위해 직원 목록 새로고침
      this.isAuthorityChangeModalOpen = false; // 모달 닫기
    },

    async updateEmployeeAuthority(employee) {
      try {
        const requestData = {
          empCode: employee.empCode,
          authCode: employee.authCode, // 기존 권한 코드.
          newAuthCode: employee.selectedAuthorityCode.value, // 새로운 권한 코드
        };

        console.log(requestData);
        await axios.post(`/authorities/changeAuthority`, requestData);
        console.log("권한이 성공적으로 업데이트되었습니다."); // 성공 메시지 표시, toast 사용 예시
      } catch (error) {
        console.error("권한 업데이트 실패:", error);
      }
    },

    openAlarmSettingsModal(employee) {
      console.log("알림 설정 모달 열림", employee);
      this.selectedEmployee = employee;
      // 모든 알람 설정을 먼저 false로 초기화
      Object.keys(this.alarmSettings).forEach((key) => {
        this.alarmSettings[key] = false;
      });
      // 사용자의 알람 설정을 조회하는 백엔드 API 호출
      axios
        .get(`/alarms/settings/${employee.empCode}`)
        .then((response) => {
          // 응답으로 받은 알람 설정으로 alarmSettings 업데이트
          response.data.forEach((setting) => {
            if (this.alarmSettings.hasOwnProperty(setting.alarmCode)) {
              this.alarmSettings[setting.alarmCode] = setting.alarmSetting;
            }
          });
        })
        .catch((error) => console.error("알람 설정 조회 실패:", error));
      this.isAlarmSettingsModalOpen = true;
    },

    async saveAlarmSettings() {
      try {
        const empCode = this.selectedEmployee.empCode;

        const requests = Object.entries(this.alarmSettings).map(
          ([alarmCode, alarmSetting]) => {
            const requestData = {
              empCode: empCode,
              alarmCode: alarmCode,
              alarmSetting: alarmSetting,
            };
            console.log(requestData); // 요청 데이터 로깅
            // 백엔드로 POST 요청 보내기
            return axios.post(`/alarms/update`, requestData);
          }
        );

        await Promise.all(requests);
        alert("알림 설정이 성공적으로 저장되었습니다."); // 성공 메시지 표시
        this.isAlarmSettingsModalOpen = false; // 모달 닫기
        this.fetchEmployeesList(); // 직원 목록 새로고침
        // 추가적인 처리...
      } catch (error) {
        console.error("알람 설정 저장 실패:", error);
        // 오류 처리...
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

.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}

.va-table thead th {
  background-color: #DEE5F2; /* 짙은 파란색 배경 */
  font-weight: bold; /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc; /* 회색 테두리 */
  font-size: 15px;
}

.left-margin{
  margin-left: 5px;
}
</style>