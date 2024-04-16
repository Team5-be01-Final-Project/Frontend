<!-- RegisterModal.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <span class="close-btn" @click="closeModal">&times;</span>
      <h2 class="modal-title">판매 제품 등록</h2>
      <div>
        <label for="client">거래처 선택</label>
        <select v-model="selectedClient" id="client">
          <option
            v-for="client in clients"
            :key="client.clientCode"
            :value="client"
          >
            {{ client.clientName }}
          </option>
        </select>
      </div>
      <div>
        <label for="product">제품 선택</label>
        <select v-model="selectedProduct" id="product" @change="handleProductChange">
          <option
            v-for="product in products"
            :key="product.proCode"
            :value="product"
          >
            {{ product.proName }}
          </option>
        </select>
      </div>
      <div>
        <label>단가</label>
        <label class="label-name">{{
          selectedProduct ? selectedProduct.proUnit : ""
        }}</label>
      </div>
      <div>
        <label for="salePrice">판매가</label>
        <input
          type="number"
          v-model.number="salePrice"
          id="salePrice"
          class="full-width-input"
          :min="selectedProduct ? selectedProduct.proUnit : ''"
          @input="validatePrice"
        />
        <p :class="{'error-message': true, 'hidden': !showInvalidPriceError}">
          판매가는 단가보다 높아야 합니다.
        </p>
      </div>
      <div class="button-group">
        <button
          type="submit"
          @click="registerProduct"
          :disabled="isInvalidPrice"
          class="submit-button"
        >
          등록
        </button>
        <button type="button" @click="closeModal" class="cancel-button">
          취소
        </button>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";

export default {
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      clients: [], // 거래처 목록
      products: [], // 제품 목록
      selectedClient: null, // 선택된 거래처
      selectedProduct: null, // 선택된 제품
      salePrice: null, // 판매가
      errorMessage: "", // 에러 메시지
      showInvalidPriceError: false, // 판매가 에러 메시지 표시 여부
    };
  },
  computed: {
    isInvalidPrice() {
      // 판매가가 단가보다 낮거나 같은 경우 판별
      return (
        this.salePrice <=
        (this.selectedProduct ? this.selectedProduct.proUnit : 0)
      );
    },
  },
  methods: {
    closeModal() {
      // 모달 닫기
      this.$emit("close");
      this.resetForm();
    },
    registerProduct() {
      // 제품 등록
      if (!this.selectedClient || !this.selectedProduct || !this.salePrice) {
        alert("거래처, 제품, 판매가를 모두 선택/입력해주세요.");
        return;
      }

      if (this.isInvalidPrice) {
        return;
      }

      const newPpc = {
        clientCode: this.selectedClient.clientCode,
        proCode: this.selectedProduct.proCode,
        ppcSale: this.salePrice,
      };

      // 해당 거래처에 이미 해당 제품이 있는지 확인
      axios
        .post(`/ppc/existing`, newPpc)
        .then((response) => {
          if (response.data) {
            // 이미 존재하는 제품이면 에러 메시지 표시 및 등록 거부
            this.errorMessage = "해당 거래처에 이미 존재하는 제품입니다.";
          } else {
            // 존재하지 않는 경우 등록 진행
            this.$emit("register", newPpc);
            this.resetForm();
          }
        })
        .catch((error) => {
          console.error("제품 등록 여부를 확인하는데 실패했습니다:", error);
          this.errorMessage = "제품 등록 여부를 확인하는데 실패했습니다.";
        });
    },
    handleProductChange() { // 다른 상품을 선택하면
      this.salePrice = null; // 판매가 초기화
      this.showInvalidPriceError = false; // 가격 오류 메시지 표시 비활성화
    },
    resetForm() {
      // 폼 초기화
      this.selectedClient = null;
      this.selectedProduct = null;
      this.salePrice = null;
      this.errorMessage = "";
      this.showInvalidPriceError = false;
    },
    fetchClients() {
      // 거래처 목록 조회
      axios
        .get("/clients/list")
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error("거래처 목록을 가져오는데 실패했습니다:", error);
        });
    },
    fetchProducts() {
      // 제품 목록 조회
      axios
        .get("/products")
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error("제품 목록을 가져오는데 실패했습니다:", error);
        });
    },
    validatePrice() {
      // 판매가 유효성 검사
      this.showInvalidPriceError = this.isInvalidPrice;
    },
  },
  created() {
    // 컴포넌트 생성 시 거래처 목록과 제품 목록 조회
    this.fetchClients();
    this.fetchProducts();
  },
};
</script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
}

/* 모달 제목에 대한 스타일 */
.modal-title {
  font-size: 24px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 굵기 설정 */
  margin-bottom: 20px; /* 아래쪽 여백 설정 */
}

label {
  display: block;
  /* 블록 요소로 표시하여 한 줄에 하나씩 표시 */
  margin-bottom: 5px;
  /* 아래쪽 여백 설정 */
  font-size: 16px;
  /* 폰트 크기 설정 */
  font-weight: bold;
  /* 폰트 굵기 설정 */
}

.label-name {
  margin-top: 10px;
  color: #888;
  font-size: 16px; /* 원하는 글씨 크기로 설정 */
  font-weight: normal; /* 필요에 따라 글씨 굵기 조절 */
  border: 1px solid #ccc; /* 테두리 스타일 및 색상 설정 */
  border-radius: 4px;
  /* 테두리 반경 설정 */
  padding: 5px;
  height: 40px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

/* 드롭다운 스타일 수정 */
.modal-content select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 드롭다운 옵션 스타일 수정 */
.modal-content select option {
  padding: 8px;
}

/* 드롭다운 옵션 스크롤바 스타일 추가 */
.modal-content select {
  overflow-y: auto;
  max-height: 150px; /* 최대 높이 지정 */
}

.error-message {
  color: red;
  margin-top: 5px;
}

.hidden { /*에러 메시지 공간 예약*/
  visibility: hidden;
}

/* 입력 필드 스타일 수정 */
.full-width-input {
  width: 100%; /* 너비를 100%로 설정 */
  padding: 8px; /* 적당한 패딩 추가 */
  border-radius: 5px; /* 모서리 둥글게 */
  border: 1px solid #ccc; /* 테두리 스타일 */
  margin-bottom: 10px; /* 하단 마진 추가 */
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
  background-color: #0056b3;
  color: #fff;
}

/* 취소 버튼에 대한 스타일 */
.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

/* 마우스를 올렸을 때 버튼에 대한 스타일 */
.submit-button:hover {
  background-color: #3a90eb;
}

.cancel-button:hover {
  background-color: #a5a5a5;
}

</style>
  