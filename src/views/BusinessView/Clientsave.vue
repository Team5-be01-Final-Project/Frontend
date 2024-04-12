<!-- Clientsave.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <BusinessSidebar />
    </div>

    <div>
      <h3 class="va-h3">거래처 등록</h3>
      <div class="col-span-1" style="height: 50px;"></div>
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <va-input label="사업자 등록번호" v-model="formattedClientCode" @input="formatClientCode" id="clientCode" type="text" required></va-input>
            <div v-if="clientCodeError" class="error-message">사업자 등록번호는 10자리여야 합니다.</div>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <va-input class="extended-margin-right" label="거래처명" v-model="client.clientName" id="clientName" type="text"
              required></va-input>

            <va-select v-model="selectedClass" label="병원 분류" :options="classes"></va-select>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="form-group">
            <va-input label="대표명" v-model="client.clientBoss" id="clientCode" type="text" required></va-input><br>
            <div class="col-span-1" style="height: 50px;"></div>
            <va-input class="extended-margin-right" label="우편번호" v-model="client.clientPost" placeholder="우편번호를 입력하세요"
              required></va-input>
            <va-button @click="openPostcodePopup()" style="margin-top: 19px;">
              우편번호 찾기
            </va-button>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="form-group">
            <va-input label="주소" v-model="client.clientWhere" placeholder="주소를 입력하세요" required></va-input>
            <div class="col-span-1" style="height: 50px;"></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <va-input class="extended-margin-right" label="담당자명" v-model="client.clientEmp" id="clientName"
                type="text" required></va-input>

              <va-input class="extended-margin-right" label="담당자 전화번호" v-model="client.clientEmpTel" id="clientName"
                type="text" required></va-input>
            </div>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <VaDateInput class="extended-margin-right" v-model="client.clientStart" label="계약시작일" clearable />
            <VaDateInput v-model="client.clientEnd" label="계약종료일" clearable />
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <VaSelect :key="selectKey" v-model="client.employee" label="담당 사원" :options="employees"></VaSelect>
            <div v-if="employeeError" class="error-message">담당 사원을 선택해주세요.</div>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <va-input class="extended-margin-right" label="비고" v-model="client.clientNote" id="clientNote"
              type="text"></va-input>
          </div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div class="col-span-1" style="height: 50px;"></div>
          <div>
            <Button type="submit" color="primary">등록</Button>
          </div>
          <va-alert v-if="errorMessage" color="danger" outline>
            {{ errorMessage }}
          </va-alert>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import axios from 'axios'
import { VaInput, VaButton, VaAlert, VaSelect, VaDateInput } from 'vuestic-ui'
// 필요한 라이브러리 및 훅을 import 합니다.
import { useRouter } from 'vue-router';
import BusinessSidebar from '@/components/sidebar/BusinessSidebar.vue'

// 컴포넌트 내부에서 useRouter 훅을 사용하여 router 인스턴스를 가져옵니다.
const router = useRouter();
const selectedClass = ref(null);
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
})

const formattedClientCode = computed({
  get() {
    return formatClientCodeDisplay(client.value.clientCode);
  },
  set(value) {
    client.value.clientCode = value.replace(/\D/g, '');
  }
});

const clientCodeError = ref(false);
const employeeError = ref(false);

function formatClientCode(event) {
  let inputValue = event.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
  client.value.clientCode = inputValue;
  clientCodeError.value = inputValue.length !== 10; // 10자리가 아닐 경우 에러 표시
}

function formatClientCodeDisplay(clientCode) {
  if (!clientCode) return '';

  const cleaned = clientCode.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{5})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return cleaned;
}

// 선택된 클래스가 변경될 때마다 실행될 함수
watch(selectedClass, (newValue) => {
  if (newValue) {
    client.value.clientClass = newValue.value;
  } else {
    client.value.clientClass = null; // 선택이 해제되었을 경우
  }
});

const errorMessage = ref('')
const valueSingle = ref('')
const value = ref(new Date()) // 계약 시작일, 기본값으로 오늘 날짜 설정
const value2 = ref(new Date()) // 계약 종료일, 기본값으로 오늘 날짜 설정
const classes = ref([{ text: '1차 병원', value: 1 }, { text: '2차 병원', value: 2 }, { text: '3차 병원', value: 3 }])
const employees = ref([]); // 사원 목록을 저장할 배열
const selectKey = ref(0); // selectKey 정의

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

const submitForm = async () => {
  try {
    if (client.value.clientCode.length !== 10) {
      clientCodeError.value = true;
      return;
    }

    if (!client.value.employee) {
      employeeError.value = true;
      return;
    }

    const formData = {
      ...client.value,
      clientStart: formatDate(client.value.clientStart),
      clientEnd: formatDate(client.value.clientEnd),
      empCode: client.value.employee ? client.value.employee.value : null,
    };

    const response = await axios.post('/clients', formData);

    if (response.status === 200 || response.status === 201) { // 성공 응답 코드 확인
      alert('거래처가 성공적으로 등록되었습니다.');
      await router.push({ name: 'viewclient' }); // 페이지 이동 대기
      return; // 함수에서 바로 빠져나와 불필요한 실행 방지
    } else {
      throw new Error('등록에 실패했습니다.'); // 서버 응답이 성공이 아닐 경우, 에러를 강제로 발생시킴
    }
  } catch (error) {
    console.error('폼 제출 중 오류:', error);
    if (error.response && error.response.data && error.response.data.message === '이미 존재하는 사업자등록번호입니다.') {
      alert('사업자등록번호가 중복입니다. 다시 시도해주세요.');
    } else {
      alert('등록에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

// 사원 정보를 불러오는 함수
onMounted(async () => {
  try {
    // URL 경로를 '/employees/list'로 수정
    const response = await axios.get('/employees/list');
    employees.value = response.data.map(emp => ({
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`, // 사원 이름으로 레이블 설정
      value: emp.empCode // 사원 코드로 값을 설정
    }));
    await nextTick();
    selectKey.value++;
    console.log(employees.value);
  } catch (error) {
    console.error('사원 정보를 불러오는 데 실패했습니다.', error);
    employees.value = []; // 오류 발생 시 employees를 빈 배열로 초기화
  }
});

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
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
}

.extended-margin-right {
  margin-right: 2rem;
  /* 원하는 간격으로 조정 */
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
