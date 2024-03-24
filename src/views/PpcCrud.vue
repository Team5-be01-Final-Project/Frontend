<template>
  <div>
    <div class="sales-registration">
      <h3>판매가 등록</h3>
      <select v-model="selectedClientCode">
        <option disabled value="">거래처 선택</option>
        <option v-for="client in clients" :key="client.clientCode" :value="client.clientCode">
          {{ client.clientName }}
        </option>
      </select>
      
      <select v-model="selectedProductCode">
        <option disabled value="">상품 선택</option>
        <option v-for="product in products" :key="product.proCode" :value="product.proCode">
          {{ product.product.proName }}
        </option>
      </select>

      <input type="number" v-model="salePrice" placeholder="판매가 입력" />
      <button @click="registerSale">등록</button>
    </div>
  <div class="product-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">모든 상품 목록</h3>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>#</th>
            <th>거래처명</th>
            <th>상품명</th>
            <th>판매가</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
  <tr v-for="(product, index) in paginatedProducts" :key="product.proCode">
    <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
    <td>{{ product.clientName }}</td>
    <td>{{ product.product.proName }}</td>
    <td>{{ product.ppcSale }}</td>
    <td>
      <button @click="showEditModal(product, index)">수정</button>
    </td>
    <td>
      <button @click="showDeleteModal(product, index)">삭제</button>
    </td>
  </tr>
</tbody>

      </table>
    </div>
    <div class="pagination">
        <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
        <VaButton
      class="mr-6 mb-2"
      preset="secondary"
      hover-behavior="opacity"
      :hover-opacity="0.4">{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
      </div>
    <Modal
      :isVisible="isModalVisible"
      :currentItem="currentItem"
      :isEditing="isEditing"
      @close="isModalVisible = false"
      @edit="updateSale"
      @delete="deleteSale"
    />
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import Modal from '@/components/Modal.vue'; // 모달 컴포넌트 경로가 확인하세요.

export default {
  components: {
    Modal,
  },
  data() {
    return {
      products: [],
      isModalVisible: false,
      currentItem: null,
      isEditing: false,
      currentIndex: null, // 현재 수정 또는 삭제 대상 아이템의 인덱스
      currentPage: 1,
      perPage: 20,
      clients: [], // 거래처 목록
      selectedClientCode: '', // 선택된 거래처 코드
      selectedProductCode: '', // 선택된 상품 코드
      salePrice: '', // 입력된 판매가
    };
  },
  computed: {
  paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    return this.products.slice(startIndex, endIndex); // `filteredProducts` 대신 `products` 사용
  },
  pageCount() {
    return Math.ceil(this.products.length / this.perPage); // 여기도 마찬가지로 `filteredProducts` 대신 `products` 사용
  }
},


methods: {
  async registerSale() {
  // 입력된 값의 유효성 검사
  if (!this.selectedClientCode || !this.selectedProductCode || !this.salePrice) {
    alert('모든 정보를 입력해주세요.');
    return;
  }

  try {
    const response = await axios.post(`/ppc/${this.selectedProductCode}`, {
      clientCode: this.selectedClientCode, // clientCode 값을 정확히 전달
      ppcSale: parseInt(this.salePrice, 10) // ppcSale 값을 정수로 변환
    });

    // 성공적으로 요청이 처리되면, 사용자에게 알림을 표시하고 필요한 후속 작업을 수행
    alert('판매가 성공적으로 등록되었습니다.');
    this.fetchProducts(); // 상품 목록 새로고침

    // 입력 필드 초기화
    this.selectedClientCode = '';
    this.selectedProductCode = '';
    this.salePrice = '';
  } catch (error) {
    console.error('판매 상품 중복:', error);
    alert('해당 거래처에 해당 상품이 이미 존재합니다.');
  }
}

,
    async fetchClients() {
      try {
        const response = await axios.get('/clients/list'); // '/api/clients'는 예시 URL입니다. 실제 경로로 교체해야 합니다.
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('/ppc/all');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    showEditModal(item, index) {
      this.currentItem = Object.assign({}, item);
      this.currentIndex = index;
      this.isEditing = true;
      this.isModalVisible = true;
    },
    showDeleteModal(item, index) {
      this.currentItem = Object.assign({}, item);
      this.currentIndex = index;
      this.isEditing = false;
      this.isModalVisible = true;
    },
    async updateSale(item) {
  try {
    const response = await axios.put(`/ppc/${item.proCode}`, {
      clientCode: item.clientCode,
      ppcSale: item.ppcSale
    });
    // 응답으로 받은 데이터로 상태 업데이트
    // 수정된 객체에서 필요한 정보만을 추출하거나, 필요한 정보를 명시적으로 추가
    const updatedItem = {
      ...this.products[this.currentIndex], // 기존 항목의 정보를 유지
      ...response.data, // 서버로부터 받은 응답으로 상태 업데이트
      clientName: this.products[this.currentIndex].clientName // `clientName`을 명시적으로 유지
    };
    // 스프레드 연산자를 사용하여 배열의 해당 항목을 업데이트하고, 전체 배열을 새로운 배열로 교체
    this.products = [
      ...this.products.slice(0, this.currentIndex),
      updatedItem,
      ...this.products.slice(this.currentIndex + 1)
    ];
    alert('판매가가 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error('Error updating sale price:', error);
    alert('판매가 수정에 실패했습니다.');
  }
  this.isModalVisible = false;
}


, async deleteSale(proCode) {
      try {
        await axios.delete(`/ppc/${proCode}`);
        this.products.splice(this.currentIndex, 1);
        alert('상품이 성공적으로 삭제됐습니다.');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('상품 삭제에 실패했습니다.');
      }
      this.isModalVisible = false;
    },
  },
  created() {
    this.fetchProducts();
    this.fetchClients();
  },
};
</script>

<style scoped>
.va-table-responsive {
  overflow: auto;
}
.pagination {
  margin-top: 20px;
}
.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}
</style>