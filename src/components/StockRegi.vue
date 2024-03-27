<!-- StockRegi.vue -->
<template>
    <div class="modal">
      <div class="modal-content">
        <h2>재고 등록</h2>
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
            <button type="submit">등록</button>
            <button type="button" @click="closeModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const proCode = ref('');
  const proName = ref('');
  const stoAmo = ref(0);
  
  const emit = defineEmits(['close']);
  
  async function getProductInfo() {
    if (proCode.value) {
      try {
        const response = await axios.get(`/api/stocks/product/${proCode.value}`);
        proName.value = response.data.proName;
      } catch (error) {
        console.error('제품 정보 조회 실패:', error);
        proName.value = '';
      }
    } else {
      proName.value = '';
    }
  }
  
  async function submitForm() {
    try {
      const stockRegisterDTO = {
        proCode: proCode.value,
        stoAmo: stoAmo.value
      };
      await axios.post('/api/stocks/register', stockRegisterDTO);
      alert('재고 등록이 완료되었습니다.');
      closeModal();
    } catch (error) {
      console.error('재고 등록 실패:', error);
      alert('재고 등록에 실패했습니다.');
    }
  }
  
  function closeModal() {
    proCode.value = '';
    proName.value = '';
    stoAmo.value = 0;
    emit('close');
  }
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
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .button-group {
    text-align: right; /* 버튼을 오른쪽 정렬합니다. */
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 5px;
  }
  
  button {
    margin-left: 5px; /* 버튼 사이의 간격 조정 */
  }
  </style>