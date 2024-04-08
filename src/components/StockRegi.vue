<template>
  <div class="modal">
    <div class="modal-content">
      <h2 class="modal-title">재고 등록</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="proCode">품목코드</label>
          <input type="text" id="proCode" v-model="proCode" @input="getProductInfo" required>
        </div>
        <div class="form-group">
          <label for="proName">제품명</label>
          <input type="text" id="proName" v-model="proName" readonly>
        </div>
        <div class="form-group">
          <label for="stoAmo">재고수량</label>
          <input type="number" id="stoAmo" v-model="stoAmo" required>
        </div>
        <div class="form-group button-group">
          <button type="submit" class="submit-button">등록</button>
          <button type="button" @click="closeModal" class="cancel-button">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Vue Composition API에서 ref 함수 가져오기
import axios from 'axios'; // axios 라이브러리 가져오기

// 변수 선언
const proCode = ref(''); // 품목코드 상태 변수
const proName = ref(''); // 제품명 상태 변수
const stoAmo = ref(0); // 재고수량 상태 변수

const emit = defineEmits(['close']); // close 이벤트 정의

// 특정 품목코드의 제품 정보를 가져오는 비동기 함수
async function getProductInfo() {
  if (proCode.value) { // 품목코드 값이 있는 경우에만 실행
    try {
      const response = await axios.get(`/stocks/product/${proCode.value}`); // API를 호출하여 제품 정보 가져오기
      proName.value = response.data.proName; // 제품명 업데이트
    } catch (error) {
      console.error('제품 정보 조회 실패:', error); // 에러 처리
      proName.value = ''; // 제품명 초기화
    }
  } else {
    proName.value = ''; // 품목코드가 비어있는 경우 제품명 초기화
  }
}

// 재고 등록 폼 제출 처리 함수
async function submitForm() {
  try {
    const stockRegisterDTO = {
      proCode: proCode.value, // 품목코드
      stoAmo: stoAmo.value // 재고수량
    };
    await axios.post('/stocks/register', stockRegisterDTO); // 재고 등록 API 호출
    alert('재고 등록이 완료되었습니다.'); // 성공 메시지 알림
    closeModal(); // 모달 닫기
  } catch (error) {
    console.error('재고 등록 실패:', error); // 에러 처리
    alert('재고 등록에 실패했습니다.'); // 실패 메시지 알림
  }
}

// 모달 닫기 함수
function closeModal() {
  proCode.value = ''; // 품목코드 초기화
  proName.value = ''; // 제품명 초기화
  stoAmo.value = 0; // 재고수량 초기화
  emit('close'); // close 이벤트 발생
}
</script>


<style scoped>
/* 모달 전체를 가리키는 스타일 */
.modal {
  position: fixed; /* 고정 위치 */
  z-index: 1; /* 다른 요소들 위에 표시 */
  left: 0; /* 왼쪽 정렬 */
  top: 0; /* 위쪽 정렬 */
  width: 100%; /* 가로 전체 차지 */
  height: 100%; /* 세로 전체 차지 */
  overflow: auto; /* 스크롤 가능하도록 설정 */
  background-color: rgba(0, 0, 0, 0.4); /* 반투명한 배경색 */
  display: flex; /* 요소를 행 또는 열로 배치하기 위해 사용 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}

/* 모달 내용을 감싸는 컨테이너에 대한 스타일 */
.modal-content {
  background-color: #fefefe; /* 백그라운드 색상 */
  margin: 15% auto; /* 위아래 여백을 15%로 설정하고 좌우 여백은 자동으로 설정 */
  padding: 30px; /* 내부 패딩 설정 */
  border: 1px solid #888; /* 테두리 설정 */
  max-width: 400px; /* 최대 가로 너비 */
  width: 100%; /* 가로 전체 차지 */
  border-radius: 8px; /* 테두리 반경 설정 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 그림자 효과 추가 */
}

/* 모달 제목에 대한 스타일 */
.modal-title {
  font-size: 24px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 굵기 설정 */
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}

/* 폼 그룹(라벨 + 입력 필드)에 대한 스타일 */
.form-group {
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}

/* 라벨에 대한 스타일 */
label {
  display: block; /* 블록 요소로 표시하여 한 줄에 하나씩 표시 */
  margin-bottom: 5px; /* 아래쪽 여백 설정 */
  font-size: 16px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 굵기 설정 */
}

/* 텍스트 입력 필드에 대한 스타일 */
input[type="text"],
input[type="number"] {
  width: 100%; /* 가로 전체 차지 */
  padding: 5px; /* 안쪽 여백 설정 */
  height: 40px; /* 높이 설정 */
  font-size: 16px; /* 폰트 크기 설정 */
  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px; /* 테두리 반경 설정 */
}

/* 버튼 그룹에 대한 스타일 */
.button-group {
  display: flex; /* 요소를 행 또는 열로 배치하기 위해 사용 */
  justify-content: space-between; /* 버튼들을 양 끝으로 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  margin-top: 30px; /* 위쪽 여백 설정 */
}

/* 등록 버튼과 취소 버튼에 대한 스타일 */
.submit-button,
.cancel-button {
  padding: 10px 20px; /* 내부 여백 설정 */
  font-size: 16px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 굵기 설정 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 테두리 반경 설정 */
  cursor: pointer; /* 커서 스타일을 포인터로 변경 */
  transition: background-color 0.3s; /* 배경색 변경에 대한 전환 효과 */
  width: 120px; /* 너비 설정 */
  height: 40px; /* 높이 설정 */
  line-height: 20px; /* 텍스트 수직 가운데 정렬 */
  margin-top: 0; /* 위쪽 여백 없음 */
}

/* 등록 버튼에 대한 스타일 */
.submit-button {
  background-color: #007bff; /* 배경색 설정 */
  color: #fff; /* 글자색 설정 */
}

/* 취소 버튼에 대한 스타일 */
.cancel-button {
  background-color: #f0f0f0; /* 배경색 설정 */
  color: #333; /* 글자색 설정 */
}

/* 마우스를 올렸을 때 버튼에 대한 스타일 */
.submit-button:hover,
.cancel-button:hover {
  background-color: #0056b3; /* 배경색 변경 */
}
</style>
