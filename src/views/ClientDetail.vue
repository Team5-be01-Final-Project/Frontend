    <template>
        <div>
        <h3>거래처 정보 수정</h3>
        <div class="form-container">
            <form @submit.prevent="submitForm">
            <div class="form-group">
                <va-input
                label="사업자 등록번호"
                v-model="client.clientCode"
                disabled
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
          v-model="selectedClass"
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
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end" >
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
    import { VaInput, VaButton, VaSelect, VaDatePicker } from 'vuestic-ui';
    
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
        employee: '',
    });
    
    const classes = ref([
        { text: '1등급', value: 1 },
        { text: '2등급', value: 2 },
        { text: '3등급', value: 3 },
    ]);
    
    const employees = ref([]);

// 서버로부터 거래처 데이터를 가져옵니다.
const fetchClientData = async () => {
  try {
    const response = await axios.get(`/clients/${clientCode}`);
    const fetchedData = response.data;
    client.value = {
      ...fetchedData,
      clientStart: new Date(fetchedData.clientStart),
      clientEnd: new Date(fetchedData.clientEnd),
      employee: fetchedData.employee ? fetchedData.employee.empCode : '',
    };
  } catch (error) {
    console.error("Failed to fetch client data:", error);
  }
};

// 서버로부터 사원 목록을 가져옵니다.
const fetchEmployees = async () => {
  try {
    const response = await axios.get('/employees/list');
    employees.value = response.data.map(emp => ({
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`,
      value: emp.empCode
    }));
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
};


// 거래처 정보를 수정합니다.
const submitForm = async () => {
  try {
    await axios.put(`/clients/${clientCode}`, {
      ...client.value,
      clientStart: client.value.clientStart.toISOString(),
      clientEnd: client.value.clientEnd.toISOString(),
      employee: client.value.employee,
    });
    alert("Client updated successfully!");
    router.push('/viewclient');
  } catch (error) {
    console.error("Failed to update client:", error);
  }
};

    // Cancel and go back to previous page or specific route
    const cancel = () => {
    router.push('/viewclient'); // Or use router.back() to go to the previous page
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
margin-right: 2rem; /* 원하는 간격으로 조정 */
}
    </style>