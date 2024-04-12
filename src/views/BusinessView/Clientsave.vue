<!-- Clientsave.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <BusinessSidebar />
    </div>

    <div>
      <h3 class="va-h3">거래처 등록</h3>
      <div class="col-span-1" style="height: 50px"></div>
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <!-- 사업자 등록번호 입력 필드 -->
            <va-input
              label="사업자 등록번호"
              v-model="formattedClientCode"
              @input="formatClientCode"
              id="clientCode"
              type="text"
              required
            ></va-input>
            <!-- 사업자 등록번호 입력 오류 메시지 -->
            <div v-if="clientCodeError" class="error-message">
              사업자 등록번호는 10자리여야 합니다.
            </div>
          </div>
          <div class="col-span-1" style="height: 50px"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <!-- 거래처명 입력 필드 -->
            <va-input
              class="extended-margin-right"
              label="거래처명"
              v-model="client.clientName"
              id="clientName"
              type="text"
              required
            ></va-input>

            <!-- 병원 분류 선택 필드 -->
            <va-select
              v-model="selectedClass"
              label="병원 분류"
              :options="classes"
            ></va-select>
          </div>
          <div class="col-span-1" style="height: 50px"></div>
          <div class="form-group">
            <!-- 대표명 입력 필드 -->
            <va-input
              label="대표명"
              v-model="client.clientBoss"
              id="clientCode"
              type="text"
              required
            ></va-input
            ><br />
            <div class="col-span-1" style="height: 50px"></div>
            <!-- 우편번호 입력 필드 -->
            <va-input
              class="extended-margin-right"
              label="우편번호"
              v-model="client.clientPost"
              placeholder="우편번호를 입력하세요"
              required
            ></va-input>
            <!-- 우편번호 찾기 버튼 -->
            <va-button @click="openPostcodePopup()" style="margin-top: 19px">
              우편번호 찾기
            </va-button>
          </div>
          <div class="col-span-1" style="height: 50px"></div>
          <div class="form-group">
            <!-- 주소 입력 필드 -->
            <va-input
              label="주소"
              v-model="client.clientWhere"
              placeholder="주소를 입력하세요"
              required
            ></va-input>
            <div class="col-span-1" style="height: 50px"></div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <!-- 담당자명 입력 필드 -->
              <va-input
                class="extended-margin-right"
                label="담당자명"
                v-model="client.clientEmp"
                id="clientName"
                type="text"
                required
              ></va-input>

              <!-- 담당자 전화번호 입력 필드 -->
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
          <div class="col-span-1" style="height: 50px"></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
          >
            <!-- 계약시작일 입력 필드 -->
            <VaDateInput
              class="extended-margin-right"
              v-model="client.clientStart"
              label="계약시작일"
              clearable
            />
            <!-- 계약종료일 입력 필드 -->
            <VaDateInput
              v-model="client.clientEnd"
              label="계약종료일"
              clearable
            />
          </div>
          <div class="col-span-1" style="height: 50px"></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
          >
            <!-- 담당 사원 선택 필드 -->
            <VaSelect
              :key="selectKey"
              v-model="client.employee"
              label="담당 사원"
              :options="employees"
            ></VaSelect>
            <!-- 담당 사원 선택 오류 메시지 -->
            <div v-if="employeeError" class="error-message">
              담당 사원을 선택해주세요.
            </div>
          </div>
          <div class="col-span-1" style="height: 50px"></div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <!-- 비고 입력 필드 -->
            <va-input
              class="extended-margin-right"
              label="비고"
              v-model="client.clientNote"
              id="clientNote"
              type="text"
            ></va-input>
          </div>
          <div class="col-span-1" style="height: 50px"></div>
          <div class="col-span-1" style="height: 50px"></div>
          <div>
            <!-- 등록 버튼 -->
            <Button type="submit" color="primary">등록</Button>
          </div>
          <!-- 오류 메시지 표시 -->
          <va-alert v-if="errorMessage" color="danger" outline>
            {{ errorMessage }}
          </va-alert>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue"; // 필요한 Vue Composition API 함수 import
import axios from "axios"; // HTTP 요청을 위한 axios 라이브러리 import
import { VaInput, VaButton, VaAlert, VaSelect, VaDateInput } from "vuestic-ui"; // Vuestic UI 컴포넌트 import
import { useRouter } from "vue-router"; // Vue Router의 useRouter 함수 import
import BusinessSidebar from "@/components/sidebar/BusinessSidebar.vue"; // 사이드바 컴포넌트 import

const router = useRouter(); // Vue Router 인스턴스 생성
const selectedClass = ref(null); // 선택된 병원 분류를 저장할 ref
const client = ref({
  // 거래처 정보를 저장할 ref 객체
  clientCode: "",
  clientName: "",
  clientClass: "",
  clientBoss: "",
  clientWhere: "",
  clientPost: "",
  clientEmp: "",
  clientEmpTel: "",
  clientStart: new Date(),
  clientEnd: new Date(),
  clientNote: "",
  employee: null,
});

const formattedClientCode = computed({
  // 사업자 등록번호를 형식화하기 위한 computed 속성
  get() {
    return formatClientCodeDisplay(client.value.clientCode); // 사업자 등록번호를 형식화하여 반환
  },
  set(value) {
    client.value.clientCode = value.replace(/\D/g, ""); // 사업자 등록번호에서 숫자 이외의 문자 제거
  },
});

const clientCodeError = ref(false); // 사업자 등록번호 입력 오류 상태를 저장할 ref
const employeeError = ref(false); // 담당 사원 선택 오류 상태를 저장할 ref

function formatClientCode(event) {
  // 사업자 등록번호 입력 시 호출되는 함수
  let inputValue = event.target.value.replace(/\D/g, ""); // 입력값에서 숫자 이외의 문자 제거
  client.value.clientCode = inputValue; // 사업자 등록번호 값 업데이트
  clientCodeError.value = inputValue.length !== 10; // 사업자 등록번호 길이 검사 후 오류 상태 업데이트
}

function formatClientCodeDisplay(clientCode) {
  // 사업자 등록번호를 형식화하는 함수
  if (!clientCode) return ""; // 사업자 등록번호가 없을 경우 빈 문자열 반환
  const cleaned = clientCode.replace(/\D/g, ""); // 사업자 등록번호에서 숫자 이외의 문자 제거
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{5})$/); // 사업자 등록번호 형식에 맞게 분할
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`; // 형식화된 사업자 등록번호 반환
  }
  return cleaned; // 형식화할 수 없는 경우 숫자만 반환
}

watch(selectedClass, (newValue) => {
  // 선택된 병원 분류가 변경될 때마다 호출되는 watch 함수
  client.value.clientClass = newValue ? newValue.value : null; // 선택된 병원 분류 값을 거래처 정보에 업데이트
});

const errorMessage = ref(""); // 오류 메시지를 저장할 ref
const classes = ref([
  { text: "1차 병원", value: 1 },
  { text: "2차 병원", value: 2 },
  { text: "3차 병원", value: 3 },
]); // 병원 분류 옵션
const employees = ref([]); // 담당 사원 목록을 저장할 ref
const selectKey = ref(0); // 담당 사원 선택 컴포넌트의 key로 사용될 ref

function formatDate(date) {
  // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

const submitForm = async () => {
  // 폼 제출 시 호출되는 함수
  if (client.value.clientCode.length !== 10) {
    // 사업자 등록번호 길이 검사
    clientCodeError.value = true; // 사업자 등록번호 오류 상태 설정
    return; // 함수 종료
  }

  if (!client.value.employee) {
    // 담당 사원 선택 여부 검사
    employeeError.value = true; // 담당 사원 선택 오류 상태 설정
    return; // 함수 종료
  }

  const formattedClientCode = formatClientCodeDisplay(client.value.clientCode); // 사업자 등록번호 형식화

  const formData = {
    // 서버로 전송할 폼 데이터 객체 생성
    ...client.value,
    clientCode: formattedClientCode, // 형식화된 사업자 등록번호 할당
    clientStart: formatDate(client.value.clientStart), // 계약시작일 형식 변환
    clientEnd: formatDate(client.value.clientEnd), // 계약종료일 형식 변환
    empCode: client.value.employee ? client.value.employee.value : null, // 선택된 담당 사원의 코드 할당
  };

  try {
    const response = await axios.post("/clients", formData); // 서버로 폼 데이터 전송
    if (response.status === 200 || response.status === 201) {
      // 응답 상태 코드 확인
      alert("거래처가 성공적으로 등록되었습니다."); // 성공 알림 표시
      await router.push({ name: "viewclient" }); // 거래처 목록 페이지로 이동
    } else {
      throw new Error("등록에 실패했습니다."); // 응답 상태 코드가 200 또는 201이 아닌 경우 에러 throw
    }
  } catch (error) {
    console.error("폼 제출 중 오류:", error); // 에러 로그 출력
    alert("등록에 실패했습니다. 다시 시도해주세요."); // 실패 알림 표시
  }
};

onMounted(async () => {
  // 컴포넌트가 마운트될 때 실행되는 함수
  try {
    const response = await axios.get("/employees/list"); // 서버로부터 담당 사원 목록 가져오기
    employees.value = response.data.map((emp) => ({
      // 담당 사원 목록 데이터 가공
      text: `${emp.empName} (${emp.posName}, ${emp.deptName})`,
      value: emp.empCode,
    }));
    await nextTick(); // DOM 업데이트를 기다림
    selectKey.value++; // 담당 사원 선택 컴포넌트의 key 값 증가
  } catch (error) {
    console.error("사원 정보를 불러오는 데 실패했습니다.", error); // 에러 로그 출력
    employees.value = []; // 담당 사원 목록 초기화
  }
});

onMounted(() => {
  // 컴포넌트가 마운트될 때 실행되는 함수
  const script = document.createElement("script"); // 동적으로 script 태그 생성
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"; // 다음 우편번호 API 스크립트 로드
  script.onload = () => {
    // 스크립트 로드 완료 후 처리할 작업
  };
  document.head.appendChild(script); // script 태그를 head에 추가하여 실행
});

const openPostcodePopup = () => {
  // 우편번호 찾기 버튼 클릭 시 호출되는 함수
  new daum.Postcode({
    // 다음 우편번호 API 팝업 생성
    oncomplete: function (data) {
      let addr = "";
      let extraAddr = "";
      if (data.userSelectedType === "R") {
        addr = data.roadAddress; // 도로명 주소를 선택한 경우
      } else {
        addr = data.jibunAddress; // 지번 주소를 선택한 경우
      }
      if (data.userSelectedType === "R") {
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname; // 법정동명이 있을 경우 추가
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName; // 건물명이 있고, 공동주택일 경우 추가
        }
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")"; // 조합된 참고항목을 괄호로 묶어서 구성
        }
      }
      client.value.clientPost = data.zonecode; // 선택한 우편번호를 거래처 정보에 할당
      client.value.clientWhere = addr; // 선택한 주소를 거래처 정보에 할당
    },
  }).open();
};
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

