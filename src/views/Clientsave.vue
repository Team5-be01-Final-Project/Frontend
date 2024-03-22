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
        <va-select
            v-model="client.employee"
            label="담당 사원"
            :options="employs.map(emp => ({ label: emp.name, value: emp.empCode }))"
        ></va-select>
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
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { VaInput, VaButton, VaAlert, VaSelect, VaDateInput } from 'vuestic-ui'
  
  const client = ref({
  clientCode: '',
  clientName: '',
  clientBoss: '',
  postcode: '',
  address: '',
  // 여기에 추가 필드
})
  
const errorMessage = ref('')
const valueSingle = ref('')
const value = ref(new Date()) // 계약 시작일, 기본값으로 오늘 날짜 설정
const value2 = ref(new Date()) // 계약 종료일, 기본값으로 오늘 날짜 설정
const classes = [1, 2, 3];
const employs = [
  { name: '사원1', empCode: 1998059743 },
  { name: '사원2', empCode: 2003117841 },
  // 여기에 나머지 사원들 추가...
];
// const employs = [1998059743, 2003117841, 2014085494, 2016101542, 2002032659, 2014121163, 2021062355, 2020096517, 2023021453, 2016060118, 2022112360, 2023039664, 2020062354, 2018050327, 1111111111, 2023079668, 2018062353]


onMounted(() => {
  const script = document.createElement('script')
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  script.onload = () => {
    // 스크립트 로드 완료 후 처리할 작업 (필요한 경우)
  }
  document.head.appendChild(script)
})
  const submitForm = async () => {
    try {
      errorMessage.value = ''
      const response = await axios.post('http://localhost:8081/clients', client.value)
      alert('클라이언트가 성공적으로 등록되었습니다.')
      console.log(response.data)
      // 성공 후 클라이언트 객체 초기화 또는 다른 페이지로 이동
      client.value = { clientCode: '', clientName: '' }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답한 에러 메시지 표시
        errorMessage.value = error.response.data
      } else {
        errorMessage.value = '사업자 번호가 중복입니다.'
      }
    }
  }

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
