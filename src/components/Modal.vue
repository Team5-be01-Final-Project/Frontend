<!-- Modal.vue -->
<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="modal-title">{{ isEditing ? "제품 수정" : "제품 삭제" }}</h2>
      <div class="form-group">
        <label>거래처명</label>
        <label class="label-name">{{ currentItem.clientName }}</label>
      </div>
      <div class="form-group">
        <label>제품명</label>
        <label class="label-name">{{ currentItem.proName }}</label>
      </div>
      <div class="form-group">
        <label>단가</label>
        <label class="label-name">{{ currentItem.proUnit }}</label>
      </div>
      <div class="form-group" v-if="isEditing">
        <label>
          판매가
          <input
            type="number"
            v-model="currentItem.ppcSale"
            :min="currentItem.proUnit"
            @input="validatePrice"
          />
          <p v-if="showInvalidPriceError" class="error-message">
            판매가는 단가보다 높아야 합니다.
          </p>
        </label>
      </div>
      <div v-else>
        <label>판매가</label>
        <label class="label-name">{{ currentItem.ppcSale }}</label>
      </div>
      <div class="button-group">
        <button
          v-if="isEditing"
          @click="confirmEdit"
          :disabled="isInvalidPrice"
          class="submit-button"
        >
          수정하기
        </button>
        <button v-else @click="confirmDelete" class="submit-button">
          삭제하기
        </button>
        <button @click="closeModal" class="cancel-button">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean, // 모달 표시 여부
    currentItem: Object, // 현재 선택된 아이템
    isEditing: Boolean, // 수정 모드 여부
  },
  data() {
    return {
      showInvalidPriceError: false, // 판매가 에러 메시지 표시 여부
    };
  },
  computed: {
    isInvalidPrice() {
      // 판매가가 단가보다 낮거나 같은 경우 판별
      return this.currentItem.ppcSale <= this.currentItem.proUnit;
    },
  },
  methods: {
    closeModal() {
      // 모달 닫기
      this.$emit("close");
    },
    confirmEdit() {
      // 수정 확인
      if (!this.isInvalidPrice) {
        this.$emit("edit", this.currentItem);
      }
    },
    confirmDelete() {
      // 삭제 확인
      this.$emit("delete", this.currentItem);
    },
    validatePrice() {
      // 판매가 유효성 검사
      this.showInvalidPriceError = this.isInvalidPrice;
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed; /* 고정 위치 */
  z-index: 1; /* 콘텐츠 위에 모달이 보이도록 z-index 설정 */
  left: 0; /* 왼쪽 정렬 */
  top: 0; /* 상단 정렬 */
  width: 100%; /* 너비 전체 */
  height: 100%; /* 높이 전체 */
  overflow: auto; /* 내용이 넘칠 경우 스크롤바 표시 */
  background-color: rgba(0, 0, 0, 0.4); /* 반투명 배경 */
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
}

input[type="number"] {
  width: 100%; /* 가로 전체 사용 */
  padding: 5px; /* 내부 여백 */
  height: 40px; /* 높이 설정 */
  font-size: 16px; /* 글자 크기 */
  border: 1px solid #ccc; /* 테두리 스타일 */
  border-radius: 4px; /* 테두리 둥글게 */
  margin-top: 10px; /* 위쪽 여백 */
}

.modal-content {
  background-color: #fefefe; /* 배경색 */
  margin: auto; /* 자동 마진으로 중앙 정렬 */
  padding: 30px; /* 내부 여백 */
  border: 1px solid #888; /* 테두리 색상 및 스타일 */
  max-width: 400px; /* 최대 너비 */
  width: 100%; /* 반응형 너비 */
  border-radius: 8px; /* 테두리 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 그림자 효과 */
}

.form-group {
  margin-bottom: 20px; /* 폼 요소 간의 여백 */
}

.modal-title {
  font-size: 24px; /* 제목 크기 */
  font-weight: bold; /* 글자 두께 */
  margin-bottom: 20px; /* 제목 아래 여백 */
}

.close {
  color: #aaa; /* 닫기 버튼 색상 */
  float: right; /* 오른쪽 정렬 */
  font-size: 28px; /* 아이콘 크기 */
  font-weight: bold; /* 아이콘 두께 */
}

.close:hover,
.close:focus {
  color: black; /* 호버 시 색상 변경 */
  text-decoration: none; /* 텍스트 꾸밈 제거 */
  cursor: pointer; /* 포인터 모양 변경 */
}

label {
  display: block; /* 블록 레벨 요소로 표시 */
  margin-bottom: 5px; /* 라벨 아래 여백 */
  font-size: 16px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
}

.label-name {
  color: #888; /* 라벨 색상 */
  font-size: 16px; /* 글자 크기 */
  font-weight: normal; /* 글자 두께 */
  border: 1px solid #ccc; /* 테두리 스타일 */
  border-radius: 4px; /* 테두리 둥글게 */
  padding: 5px; /* 내부 여백 */
  height: 40px; /* 높이 */
  margin-top: 10px; /* 위쪽 여백 */
}

.button-group {
  display: flex; /* 플렉스박스 모델 적용 */
  justify-content: space-between; /* 버튼 간격 동일하게 설정 */
  align-items: center; /* 세로 중앙 정렬 */
  margin-top: 30px; /* 위쪽 여백 */
}

.submit-button,
.cancel-button {
  padding: 10px 20px; /* 버튼 내부 여백 */
  font-size: 16px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 테두리 둥글게 */
  cursor: pointer; /* 클릭 가능 표시 */
  transition: background-color 0.3s; /* 배경색 변경 애니메이션 */
  width: 120px; /* 너비 */
  height: 40px; /* 높이 */
  line-height: 20px; /* 라인 높이 */
}

.submit-button {
  background-color: #154ec1; /* 배경색 */
  color: white; /* 글자색 */
}

.cancel-button {
  background-color: #f0f0f0; /* 배경색 */
  color: #333; /* 글자색 */
}

.submit-button:hover {
  background-color: #8bc3ff; /* 호버시 배경색 */
}

.cancel-button:hover {
  background-color: #9b9b9b; /* 호버시 배경색 */
}
</style>