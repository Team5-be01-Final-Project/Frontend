<!-- Modal.vue -->
<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="modal-title">{{ isEditing ? '제품 수정' : '제품 삭제' }}</h2>
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
          <input type="number" v-model="currentItem.ppcSale" />
        </label>
      </div>
      <div v-else>
        <label>판매가</label>
        <label class="label-name">{{ currentItem.ppcSale }}</label>
      </div>
      <div class="button-group">
        <button v-if="isEditing" @click="confirmEdit" class="submit-button">
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
    isVisible: Boolean,
    currentItem: Object,
    isEditing: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmEdit() {
      this.$emit('edit', this.currentItem);
    },
    confirmDelete() {
      this.$emit('delete', this.currentItem);
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

input[type='number'] {
  width: 100%; /* 가로 전체 차지 */
  padding: 5px; /* 안쪽 여백 설정 */
  height: 40px; /* 높이 설정 */
  font-size: 16px; /* 폰트 크기 설정 */
  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px; /* 테두리 반경 설정 */
  margin-top: 10px;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 30px;
  border: 1px solid #888;
  max-width: 400px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

label {
  display: block; /* 블록 요소로 표시하여 한 줄에 하나씩 표시 */
  margin-bottom: 5px; /* 아래쪽 여백 설정 */
  font-size: 16px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 굵기 설정 */
}

.label-name {
  margin-top: 10px;
  color: #888;
  font-size: 16px; /* 원하는 글씨 크기로 설정 */
  font-weight: normal; /* 필요에 따라 글씨 굵기 조절 */
  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px; /* 테두리 반경 설정 */
  padding: 5px;
  height: 40px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 120px;
  height: 40px;
  line-height: 20px;
  margin-top: 0;
}

.submit-button {
  background-color: #154EC1;
  color: #fff;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.submit-button:hover{
  background-color: #8bc3ff;
}

.cancel-button:hover {
  background-color: #9b9b9b;
}
</style>