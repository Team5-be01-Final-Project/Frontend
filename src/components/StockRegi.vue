<!-- StockRegi.vue -->
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
    display: flex;
    justify-content: center;
    align-items: center;
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
  
  .modal-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 5px;
    height: 40px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
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
  }
  
  .submit-button {
    background-color: #007bff;
    color: #fff;
    margin-right: 10px;
  }
  
  .submit-button:hover {
    background-color: #0056b3;
  }
  
  .cancel-button {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .cancel-button:hover {
    background-color: #e0e0e0;
  }
  </style>