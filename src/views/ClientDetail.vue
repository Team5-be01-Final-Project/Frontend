<template>
    <div>
      <h3>거래처 정보 수정</h3>
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <va-input label="사업자 등록번호" v-model="client.clientCode" disabled></va-input>
          </div>
          <div class="form-group">
            <va-input label="거래처명" v-model="client.clientName" required></va-input>
          </div>
          <div class="form-group">
            <va-select label="병원 분류" v-model="client.clientClass" :options="classes"></va-select>
          </div>
          <div class="form-group">
            <va-input label="대표명" v-model="client.clientBoss" required></va-input>
          </div>
          <div class="form-group">
            <va-input label="우편번호" v-model="client.clientPost" required></va-input>
            <va-button @click="openPostcodePopup">우편번호 찾기</va-button>
          </div>
          <div class="form-group">
            <va-input label="주소" v-model="client.clientWhere" required></va-input>
          </div>
          <div class="form-group">
            <va-input label="담당자명" v-model="client.clientEmp" required></va-input>
          </div>
          <div class="form-group">
            <va-input label="담당자 전화번호" v-model="client.clientEmpTel" required></va-input>
          </div>
          <div class="form-group">
            <va-date-picker label="계약시작일" v-model="client.clientStart" required></va-date-picker>
          </div>
          <div class="form-group">
            <va-date-picker label="계약종료일" v-model="client.clientEnd" required></va-date-picker>
          </div>
          <div class="form-group">
            <va-select label="담당 사원" v-model="client.employee" :options="employees"></va-select>
          </div>
          <div class="form-group">
            <va-input label="비고" v-model="client.clientNote" type="textarea"></va-input>
          </div>
          <div class="form-group actions">
            <va-button color="primary" type="submit">수정 완료</va-button>
            <va-button color="secondary" @click="cancel">취소</va-button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { VaInput, VaButton, VaSelect, VaDatePicker,VaTextarea  } from 'vuestic-ui';

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
  clientStart: new Date(), // 기본값을 오늘 날짜로 설정
  clientEnd: new Date(), // 기본값을 오늘 날짜로 설정
  clientNote: '',
  employee: '',
});

const classes = ref([
  { text: '1등급', value: 1 },
  { text: '2등급', value: 2 },
  { text: '3등급', value: 3 },
]);

const employees = ref([]);

const fetchClientData = async () => {
  try {
    const response = await axios.get(`/clients/${clientCode}`);
    const data = response.data;

    // 서버 응답에서 날짜를 Date 객체로 변환
    const clientStart = data.clientStart ? new Date(data.clientStart) : new Date();
    const clientEnd = data.clientEnd ? new Date(data.clientEnd) : new Date();

    client.value = {
      ...data,
      clientStart,
      clientEnd,
      employee: data.employee ? data.employee.empCode : '', // "employee" 객체가 있다면 "empCode"만 추출
    };
  } catch (error) {
    console.error('거래처 정보를 불러오는 데 실패했습니다:', error);
    router.push('/viewclient'); // 데이터를 가져오는 데 실패했을 때의 리디렉션 주소
  }
};

const fetchEmployees
= async () => {
  try {
    const response = await axios.get('/employees/list');
    employees.value = response.data.map(emp => ({
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`,
      value: emp.empCode
    }));
  } catch (error) {
    console.error('사원 정보를 불러오는 데 실패했습니다:', error);
  }
};

const submitForm = async () => {
  try {
    const formData = {
      ...client.value,
      // 서버가 요구하는 날짜 형식으로 변환 (예: ISO 문자열)
      clientStart: client.value.clientStart.toISOString(),
      clientEnd: client.value.clientEnd.toISOString(),
      // employee 객체를 기대하는 경우 아래와 같이 조정
      employee: client.value.employee ? { empCode: client.value.employee } : null,
    };

    await axios.put(`/clients/${clientCode}`, formData);
    alert('거래처 정보가 성공적으로 수정되었습니다.');
    router.push('/viewclient'); // 수정 완료 후 리디렉션 주소
  } catch (error) {
    console.error('거래처 정보 수정 중 오류가 발생했습니다:', error);
    alert('거래처 정보 수정 중 오류가 발생했습니다.');
  }
};

const cancel = () => {
  router.push('/viewclient');
};

onMounted(() => {
  fetchClientData();
  fetchEmployees();
});

const openPostcodePopup = () => {
  // 여기에 우편번호 찾기 팝업 로직을 구현하세요.
  // 예: daum.Postcode.load()...
};
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
</style>