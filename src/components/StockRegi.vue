<!-- StockRegi.vue -->
<template>
  <transition name="modal" appear>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <h2 class="modal-title">재고 등록</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="proName">제품명</label>
            <select id="proName" v-model="proName" @change="getProductInfo" required>
              <option disabled value="">제품을 선택해주세요</option>
              <option v-for="product in products" :key="product.id" :value="product.name">
                {{ product.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="proCode">품목코드</label>
            <input type="text" id="proCode" v-model="proCode" readonly>
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
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 변수 선언
const proName = ref('');
const proCode = ref('');
const stoAmo = ref(0);
const products = ref([]);  
const emit = defineEmits(['close']);
const show = ref(true);

// 페이지 로드 시 제품 목록을 가져오는 함수
onMounted(async () => {
    try {
        const response = await axios.get('/stocks/all');
        products.value = response.data.map(product => ({
            id: product.proCode,
            name: product.proName,
            code: product.proCode
        }));
    } catch (error) {
        console.error('제품 목록 로드 실패:', error);
    }
});

// 선택된 제품명에 따라 품목 코드를 업데이트하는 함수
async function getProductInfo() {
    if (proName.value) {
        try {
            const response = await axios.get(`/stocks/product/${encodeURIComponent(proName.value)}`);
            proCode.value = response.data.proCode;
        } catch (error) {
            console.error('제품 정보 조회 실패:', error);
            proCode.value = '';
        }
    }
}

// 재고 등록 처리 함수
async function submitForm() {
    try {
        const stockRegisterDTO = {
            proName: proName.value,
            proCode: proCode.value,
            stoAmo: stoAmo.value
        };
        await axios.post('/stocks/register', stockRegisterDTO);
        alert('재고 등록이 완료되었습니다.');
        closeModal();
    } catch (error) {
        console.error('재고 등록 실패:', error);
        alert('재고 등록에 실패했습니다.');
    }
}

// 모달 닫기 함수
function closeModal() {
  show.value = false;
  setTimeout(() => {
    proName.value = '';
    proCode.value = '';
    stoAmo.value = 0;
    emit('close');
  }, 300);
}
</script>

<style scoped>
/* 모달 전체를 가리키는 스타일 */
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

/* 모달 내용을 감싸는 컨테이너에 대한 스타일 */
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

/* 모달 제목에 대한 스타일 */
.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 폼 그룹(라벨 + 입력 필드)에 대한 스타일 */
.form-group {
  margin-bottom: 20px;
}

/* 라벨에 대한 스타일 */
label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}

/* 텍스트 입력 필드에 대한 스타일 */
input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 5px;
  height: 40px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

select {
  width: 100%;
  padding: 5px;
  height: 40px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 버튼 그룹에 대한 스타일 */
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

/* 등록 버튼과 취소 버튼에 대한 스타일 */
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

/* 등록 버튼에 대한 스타일 */
.submit-button {
  background-color: #154EC1;
  color: #fff;
}

/* 취소 버튼에 대한 스타일 */
.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

/* 마우스를 올렸을 때 버튼에 대한 스타일 */
.submit-button:hover,
.cancel-button:hover {
  background-color: #0056b3;
}

/* 모달 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>