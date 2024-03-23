<template>
    <div>
      <h3>클라이언트 등록</h3>
      <div class="col-span-1" style="height: 50px;"></div>
      <div class="col-span-1" style="height: 50px;"></div>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <va-input
            label="사업자 등록번호"
            v-model="client.clientCode"
            id="clientCode"
            type="text"
            required
          ></va-input>
        </div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <va-input
        class="extended-margin-right" 
            label="거래처명"
            v-model="client.clientName"
            id="clientName"
            type="text"
            required
        ></va-input>

        <va-select
            v-model="client.clientClass"
            label="병원 분류"
            :options="classes"
        ></va-select>
        </div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="form-group">
          <va-input
            label="대표명"
            v-model="client.clientBoss"
            id="clientCode"
            type="text"
            required
          ></va-input><br>
          <div class="col-span-1" style="height: 50px;"></div>
          <va-input
          class="extended-margin-right"
          label="우편번호"
          v-model="client.clientPost"
          placeholder="우편번호를 입력하세요"
          required
        ></va-input>
        <va-button
          @click="openPostcodePopup()"
          style="margin-top: 19px;"
        >
          우편번호 찾기
        </va-button>
      </div>
      <div class="col-span-1" style="height: 50px;"></div>
      <div class="form-group">
        <va-input
          label="주소"
          v-model="client.clientWhere"
          placeholder="주소를 입력하세요"
          required
        ></va-input>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <va-input
        class="extended-margin-right" 
            label="담당자명"
            v-model="client.clientEmp"
            id="clientName"
            type="text"
            required
        ></va-input>

        <va-input
        class="extended-margin-right" 
            label="담당자 전화번호"
            v-model="client.clientEmpTel"
            id="clientName"
            type="text"
            required
        ></va-input>
        </div>      
        </div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <VaDateInput
            class="extended-margin-right"
                 v-model="client.clientStart"
                 label="계약시작일"
                 clearable
            />
            <VaDateInput
            v-model="client.clientEnd"
            label="계약종료일"
            clearable
            />
        </div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <VaSelect
        :key="selectKey"
        v-model="client.employee"
        label="담당 사원"
        :options="employees"
      ></VaSelect>
        </div>
        <div class="col-span-1" style="height: 50px;"></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <va-input
        class="extended-margin-right" 
            label="비고"
            v-model="client.clientNote"
            id="clientNote"
            type="text"
        ></va-input>
        </div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="col-span-1" style="height: 50px;"></div>
        <div class="form-group" style="display: flex; justify-content: flex-end;">
          <va-button type="submit" color="primary">등록</va-button>
        </div>
        <va-alert v-if="errorMessage" color="danger" outline>
          {{ errorMessage }}
        </va-alert>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick  } from 'vue'
  import axios from 'axios'
  import { VaInput, VaButton, VaAlert, VaSelect, VaDateInput } from 'vuestic-ui'
  
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
  
const errorMessage = ref('')
const valueSingle = ref('')
const value = ref(new Date()) // 계약 시작일, 기본값으로 오늘 날짜 설정
const value2 = ref(new Date()) // 계약 종료일, 기본값으로 오늘 날짜 설정
const classes = [1,2,3]
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
    const formData = {
      ...client.value,
      clientStart: formatDate(client.value.clientStart),
      clientEnd: formatDate(client.value.clientEnd),
      empCode: client.value.employee ? client.value.employee.value : null,
    };

    console.log("제출 전 formData:", formData);

    errorMessage.value = '';
    const response = await axios.post('/clients', formData);
    alert('클라이언트가 성공적으로 등록되었습니다.');
    console.log(response.data);
    // 폼 초기화 로직
  } catch (error) {
    console.error('폼 제출 중 오류:', error);
    errorMessage.value = '사업자 등록번호가 중복됩니다.';
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
    oncomplete: function(data) {
      let addr = '';
      let extraAddr = '';
      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }
      if(data.userSelectedType === 'R'){
        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
          extraAddr += data.bname;
        }
        if(data.buildingName !== '' && data.apartment === 'Y'){
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if(extraAddr !== ''){
          extraAddr = ' (' + extraAddr + ')';
        }
      }
      client.value.clientPost = data.zonecode;
      client.value.clientWhere  = addr;
    }
  }).open();
}
  </script>
<style>
.extended-margin-right {
  margin-right: 2rem; /* 원하는 간격으로 조정 */

}
</style>
