<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <SystemSidebar />
    </div>


    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">사원 리스트 조회</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <VaSelect v-model="selectedDept" placeholder="부서" :options="[
            { text: '전체', value: '' },
            { text: '이사회', value: '이사회' },
            { text: '영업 1팀', value: '영업 1팀' },
            { text: '영업 2팀', value: '영업 2팀' },
            { text: '영업 3팀', value: '영업 3팀' },
            { text: '시스템', value: '시스템' }
          ]" value-by="value" />
          <VaSelect v-model="selectedSearchCondition" placeholder="검색 조건" :options="[
            { text: '이름', value: 'empName' },
            { text: '이메일', value: 'empEmail' },
          ]" value-by="value" />
          <VaInput v-model="searchText" placeholder="검색어 입력" class="w-full" />
          <VaButton @click="fetchFilteredEmployees">검색</VaButton>
        </div>

        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <th>사진</th>
              <th>사번</th>
              <th>이름</th>
              <th>직급</th>
              <th>부서</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>입사일</th>
              <th>퇴사일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.empCode">
              <td><img :src="employee.empImg" alt="Employee Image" class="employee-image" /></td>
              <td>{{ employee.empCode }}</td>
              <td>{{ employee.empName }}</td>
              <td>{{ employee.posName }}</td>
              <td>{{ employee.deptName }}</td>
              <td>{{ employee.empTel }}</td>
              <td>{{ employee.empEmail }}</td>
              <td>{{ employee.empStartDate }}</td>
              <td>{{ employee.empEndDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <VaModal v-model="isAuthorityChangeModalOpen" title="권한 변경 확인" @ok="AuthorityChangeModalproceedChange" ok-text="변경"
    @cancel="AuthorityChangeModalcancelChange" cancel-text="취소">
    <h4>권한을 변경 하시겠습니까?</h4>
  </VaModal>

  <VaModal v-model="isAlarmSettingsModalOpen" ok-text="저장" cancel-text="취소" @ok="saveAlarmSettings">
    <template #header>
      <h4>알림 설정 변경</h4>
    </template>

    <div class="flex flex-col">
      <div v-for="(value, code) in alarmSettings" :key="code" class="mb-6">
        <VaCheckbox :value="code" v-model="alarmSettings[code]" :label="`알림 ${code}`" />
      </div>
    </div>

  </VaModal>

</template>

<script>
import axios from 'axios';
import { VaButton } from 'vuestic-ui/web-components';
import SystemSidebar from '@/components/sidebar/SystemSidebar.vue'


export default {
  components: {
    SystemSidebar
  },
  data() {
    return {
      employees: [],
      loading: true,
      currentPage: 1,
      selectedDept: null, // 부서 선택을 위한 변수
      selectedSearchCondition: null, // 검색 조건 선택을 위한 변수
      searchText: '', // 검색어 입력을 위한 변수
      employee: {
        originalAuthorityCode: null,
        selectedAuthorityCode: null,
      },
      authorityCodes: [],
      changingEmployee: null, // 권한 변경할 직원 정보 저장
      isAlarmSettingsModalOpen: false,
      alarmSettings: {
        'AL01': false, // 이상 온도 알림
        // 'AL02': false, // 이상 압력 알림
      },
    };
  },

  computed: {
    SystemSidebar,
    authorityCodeOptions() {
      return this.authorityCodes.map(code => ({
        text: code.authName, // 사용자에게 보여질 텍스트
        value: code.authCode // 실제 선택 시 반환될 값
      }));
    }
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
          params.append('deptName', this.selectedDept);
        }
        if (this.searchText && this.selectedSearchCondition) {
          params.append(this.selectedSearchCondition, this.searchText);
        }
        const response = await axios.get(`employees/list?${params.toString()}`);
        this.employees = response.data;
        this.employees = response.data.map(employee => ({
          ...employee,
          // 백엔드로부터 받은 권한 코드를 selectedAuthorityCode에 설정,
          selectedAuthorityCode: {
            text: employee.authName,
            value: employee.authCode
          },
        }));
      } catch (error) {
        console.error('필터링된 데이터 가져오기 실패:', error);
      }
    },
    async fetchEmployeesList() {
      try {
        const response = await axios.get(`/employees/specs`);
        this.employees = response.data; // 응답 데이터 할당
        this.employees = response.data.map(employee => ({
          ...employee,
          // 백엔드로부터 받은 권한 코드를 selectedAuthorityCode에 설정
          selectedAuthorityCode: {
            text: employee.authName,
            value: employee.authCode
          },
        }));
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAuthorityCodes() {
      try {
        const response = await axios.get('/authorities/codes');
        this.authorityCodes = response.data.map(item => ({
          authName: item.authName,
          authCode: item.authCode,
        }));
      } catch (error) {
        console.error('권한 코드 가져오기 실패:', error);
      }
    },


  }
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
</style>