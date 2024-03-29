<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h3>{{ isEditing ? '상품 수정' : '상품 삭제' }}</h3>
      <p>거래처명: {{ currentItem.clientName }}</p>
      <p>상품명: {{ currentItem.proName }}</p>
      <p>판매가: {{ currentItem.ppcSale }}</p>
      <p v-if="isEditing">판매가: <input type="number" v-model="currentItem.ppcSale" /></p>
        <p v-else>판매가: {{ currentItem.ppcSale }}</p>
      <button v-if="isEditing" @click="confirmEdit">수정하기</button>
      <button v-else @click="confirmDelete">삭제하기</button>
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
      this.$emit('delete', this.currentItem.proCode); // 수정
    },
  },
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 30px;
  border: 1px solid #888;
  width: 60%;
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
</style>
