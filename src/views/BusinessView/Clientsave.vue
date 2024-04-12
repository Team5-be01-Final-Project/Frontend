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
import { useRouter } from 'vue-router';
import BusinessSidebar from '@/components/sidebar/BusinessSidebar.vue'

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
  let inputValue = event.target.value.replace(/\D/g, '');
  client.value.clientCode = inputValue;
  clientCodeError.value = inputValue.length !== 10;
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

watch(selectedClass, (newValue) => {
  client.value.clientClass = newValue ? newValue.value : null;
});

const errorMessage = ref('')
const classes = ref([{ text: '1차 병원', value: 1 }, { text: '2차 병원', value: 2 }, { text: '3차 병원', value: 3 }])
const employees = ref([]);
const selectKey = ref(0);

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
  if (client.value.clientCode.length !== 10) {
    clientCodeError.value = true;
    return;
  }

  if (!client.value.employee) {
    employeeError.value = true;
    return;
  }

  const formattedClientCode = formatClientCodeDisplay(client.value.clientCode);

  const formData = {
    ...client.value,
    clientCode: formattedClientCode,
    clientStart: formatDate(client.value.clientStart),
    clientEnd: formatDate(client.value.clientEnd),
    empCode: client.value.employee ? client.value.employee.value : null,
  };

  try {
    const response = await axios.post('/clients', formData);
    if (response.status === 200 || response.status === 201) {
      alert('거래처가 성공적으로 등록되었습니다.');
      await router.push({ name: 'viewclient' });
    } else {
      throw new Error('등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('폼 제출 중 오류:', error);
    alert('등록에 실패했습니다. 다시 시도해주세요.');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get('/employees/list');
    employees.value = response.data.map(emp => ({
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`,
      value: emp.empCode
    }));
    await nextTick();
    selectKey.value++;
  } catch (error) {
    console.error('사원 정보를 불러오는 데 실패했습니다.', error);
    employees.value = [];
  }
});

onMounted(() => {
  const script = document.createElement('script')
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  script.onload = () => {
    // 스크립트 로드 완료 후 처리할 작업
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
  max-width: 600px; /* 최대 너비 설정 */
  margin: auto; /* 중앙 정렬 */
}

.extended-margin-right {
  margin-right: 2rem; /* 오른쪽 마진 추가 */
}

.error-message {
  color: red; /* 에러 메시지 색상 */
  font-size: 14px; /* 폰트 크기 */
  margin-top: 5px; /* 상단 여백 */
}
</style>

