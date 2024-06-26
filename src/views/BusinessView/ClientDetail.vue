<template>

  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <BusinessSidebar />
    </div>

    <div class = "Main">
      <h3 class="va-h3">거래처 정보 수정</h3>
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <va-input label="사업자 등록번호" v-model="client.clientCode" disabled></va-input>
          </div>

          <div  style="height: 50px;"></div>
          <div >
            <va-input class="extended-margin-right" label="거래처명" v-model="client.clientName" id="clientName" type="text"
              required></va-input>

              <va-select v-model="selectedClass" label="병원 분류" :options="classes"></va-select>
            <div v-if="classError" class="error-message1">
              병원분류를 입력해주세요.
            </div>
                    </div>
          <div  style="height: 50px;"></div>
          <div class="form-group">
            <va-input label="대표명" v-model="client.clientBoss" id="clientCode" type="text" required></va-input><br>
            <div  style="height: 50px;"></div>
            <va-input class="extended-margin-right" label="우편번호" v-model="client.clientPost" placeholder="우편번호를 입력하세요"
              required></va-input>
            <va-button @click="openPostcodePopup()" style="margin-top: 19px;">
              우편번호 찾기
            </va-button>
          </div>
          <div  style="height: 50px;"></div>
          <div class="form-group">
            <va-input label="주소" v-model="client.clientWhere" placeholder="주소를 입력하세요" required></va-input>
            <div  style="height: 50px;"></div>
            <div >
              <va-input class="extended-margin-right" label="담당자명" v-model="client.clientEmp" id="clientName"
                type="text" required></va-input>

              <va-input class="extended-margin-right" label="담당자 전화번호" v-model="client.clientEmpTel" id="clientName"
                type="text" required></va-input>
            </div>
          </div>
          <div  style="height: 50px;"></div>
          <div >
            <VaDateInput v-model="client.clientStart" label="계약시작일" clearable style="margin-right: 2rem;" />
            <VaDateInput v-model="client.clientEnd" label="계약종료일" clearable />
          </div>
          <div v-if="dateError" class="error-message2">
            계약 종료일은 시작일 이후여야 합니다.
          </div>
          <div  style="height: 50px;"></div>
          <div >
            <VaSelect :key="selectKey" v-model="selectedEmployee" label="담당 사원" :options="employees"
              @input="updateSelectedEmployee"></VaSelect>
          </div>
          <div  style="height: 50px;"></div>

          <div >
            <va-input class="extended-margin-right" label="비고" v-model="client.clientNote" id="clientNote"
              type="text"></va-input>
          </div>
          <div style="height: 50px;"></div>
          <div  style="height: 50px;"></div>
          <div class="form-group actions">
            <button color="primary" type="submit" style="width: 45%;">수정 완료</button>
            <button color="danger" type="submit" style="width: 45%;" @click="cancel">취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { VaInput, VaButton, VaSelect, VaDatePicker } from 'vuestic-ui';
import BusinessSidebar from '@/components/sidebar/BusinessSidebar.vue'

const selectedClass = ref(null);
const selectedEmployee = ref(null);
const route = useRoute();
const router = useRouter();
const clientCode = route.params.clientCode;
const client = ref({
  clientCode: '',
  clientName: '',
  clientClass: '',
  clientBoss: '',
  clientWhere: '',
  clientPost: '',
  clientEmp: '',
  clientEmpTel: '',
  clientStart: new Date(),
  clientEnd: new Date(),
  clientNote: '',
  employee: null,
});

const classes = ref([
  { text: '1차 병원', value: 1 },
  { text: '2차 병원', value: 2 },
  { text: '3차 병원', value: 3 },
]);

const employees = ref([]);
const employeeError = ref(false); // 담당 사원 선택 오류 상태를 저장할 ref
const classError = ref(false);  // 병원 분류 오류 상태를 저장할 ref
const dateError = ref(false); // 계약날짜에 대한 오류 상태를 저장할 ref

// 서버로부터 거래처 데이터를 가져옵니다.
const fetchClientData = async () => {
  try {
    const response = await axios.get(`/clients/${clientCode}`);
    if (response.status === 200 && response.data) {
      const fetchedData = response.data;

      // clientClass와 employee(empCode) 값에 따라 selectedClass와 selectedEmployee를 설정
      // 예시에서는 clientClass와 empCode를 직접 사용할 수 있는 구조로 가정하고 있습니다.
      // 실제로는 서버에서 받은 데이터 구조에 맞게 접근해야 할 수도 있습니다.
      selectedClass.value = classes.value.find(c => c.value === fetchedData.clientClass);
      selectedEmployee.value = employees.value.find(e => e.value === fetchedData.empCode);

      // 날짜 형식은 변환 필요
      client.value = {
        ...fetchedData,
        clientStart: new Date(fetchedData.clientStart),
        clientEnd: new Date(fetchedData.clientEnd),
        // clientClass와 employee는 위에서 설정한 selectedClass와 selectedEmployee를 사용
      };
    } else {
      console.error("Server response not OK:", response);
    }
  } catch (error) {
    console.error("Failed to fetch client data:", error);
  }
};

// 사원 목록을 불러오는 부분
const fetchEmployees = async () => {
  try {
    const response = await axios.get('/employees/list');
    employees.value = response.data.filter(emp => emp.authCode ==="AUTH004").map(emp => ({
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`,
      value: emp.empCode
    }));
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
};



// 선택된 사원의 empCode를 client.employee에 할당
const updateSelectedEmployee = (newValue) => {
  client.value.employee = newValue ? newValue.value : null;
};

watch(selectedClass, (newValue) => {
  // 선택된 병원 분류가 변경될 때마다 호출되는 watch 함수
  client.value.clientClass = newValue ? newValue.value : null; // 선택된 병원 분류 값을 거래처 정보에 업데이트
  classError.value = !newValue;
});

// 계약 시작일과 종료일의 변경을 감시
watch([() => client.value.clientStart, () => client.value.clientEnd], ([newStart, newEnd]) => {
  if (new Date(newStart) > new Date(newEnd)) {
    dateError.value = true;  // 시작일이 종료일보다 뒤일 경우 에러
  } else {
    dateError.value = false; // 유효한 날짜일 경우 에러 상태 해제
  }
});

// 담당 사원 선택 감시
watch(() => client.value.employee, (newValue) => {
  employeeError.value = !newValue;  // 사원이 선택되지 않았을 때 에러 상태 활성화
});

const submitForm = async () => {
  // 폼 제출 시 호출되는 함수
  // 계약 시작일과 종료일 비교
  if (new Date(client.value.clientStart) > new Date(client.value.clientEnd)) {
    dateError.value = true;
    return; // 경고 메시지 설정 후 함수 종료
  }
  const clientData = {
    clientCode: client.value.clientCode,
    clientName: client.value.clientName,
    clientClass: selectedClass.value.value, // 클래스 선택값
    clientBoss: client.value.clientBoss,
    clientWhere: client.value.clientWhere,
    clientPost: client.value.clientPost,
    clientEmp: client.value.clientEmp,
    clientEmpTel: client.value.clientEmpTel,
    clientStart: client.value.clientStart.toISOString(),
    clientEnd: client.value.clientEnd.toISOString(),
    clientNote: client.value.clientNote,
    empCode: selectedEmployee.value.value, // 직원 선택값
  };


  try {
    const response = await axios.put(`/clients/${client.value.clientCode}`, clientData);
    console.log(response.data);
    alert("거래처 수정이 완료되었습니다.");
    router.push({ name: 'viewclient' });
  } catch (error) {
    console.error("Failed to update client:", error);
    alert("거래처 수정에 실패했습니다.");
  }
};

// Cancel and go back to previous page or specific route
const cancel = () => {
  router.push({ name: 'viewclient' }); // Or use router.back() to go to the previous page
};

onMounted(() => {
  const script = document.createElement('script')
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  script.onload = () => {
    // 스크립트 로드 완료 후 처리할 작업 (필요한 경우)
  }
  document.head.appendChild(script)
})
const openPostcodePopup = () => {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';
      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }
      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      }
      client.value.clientPost = data.zonecode;
      client.value.clientWhere = addr;
    }
  }).open();
}

onMounted(() => {
  fetchClientData();
  fetchEmployees();
});
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
}

.form-group {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.extended-margin-right {
  margin-right: 2rem;
  /* 원하는 간격으로 조정 */
}
.error-message2 {
  color: red;
  /* 에러 메시지 색상 */
  font-size: 14px;
  /* 폰트 크기 */
  margin-top: 5px;
  /* 상단 여백 */
  margin-left: 285px;
}

</style>