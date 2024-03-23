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
          <tr v-for="(product, index) in products" :key="product.proCode">
            <td>{{ index + 1 }}</td>
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
      clients: [],
      products: [],
      selectedClientCode: '',
      selectedProductCode: '',
      salePrice: '',
      products: [],
      isModalVisible: false,
      currentItem: null,
      isEditing: false,
      currentIndex: null, // 현재 수정 또는 삭제 대상 아이템의 인덱스
    };
  },
  methods: {
    fetchData() {
      axios.get('/ppc/data')
        .then(response => {
          this.clients = response.data.clients;
          this.products = response.data.products;
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        });
    },
    registerSale() {
      // 선택된 거래처, 상품, 입력된 판매가를 백엔드로 전송하는 로직
      axios.post(`/ppc/${this.selectedProductCode}`, {
        clientCode: this.selectedClientCode,
        ppcSale: this.salePrice
      })
      .then(() => {
        alert('판매가가 성공적으로 등록되었습니다.');
        this.fetchProducts(); // 상품 목록을 새로고침
      })
      .catch(error => {
        console.error('판매가 등록에 실패했습니다:', error);
        alert('판매가 등록에 실패했습니다.');
      });
      axios.post('/api/sales', { // API 경로는 백엔드 설정에 따라 달라질 수 있습니다.
        clientCode: this.selectedClient,
        proCode: this.selectedProduct,
        salePrice: this.salePrice
      })
      .then(() => {
        alert('상품이 성공적으로 등록되었습니다.');
        this.fetchProducts(); // 상품 목록 새로고침
      })
      .catch(error => {
        console.error('상품 등록 중 오류가 발생했습니다:', error);
        alert('상품 등록에 실패했습니다.');
      });
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
        await axios.post(`/ppc/${item.proCode}`, { clientCode: item.clientCode, ppcSale: item.ppcSale });
        this.products[this.currentIndex] = item; // 목록에서 해당 아이템을 업데이트
        alert('판매가가 성공적으로 수정되었습니다.');
      } catch (error) {
        console.error('Error updating sale price:', error);
        alert('판매가 수정에 실패했습니다.');
      }
      this.isModalVisible = false;
    },
    async deleteSale(proCode) {
  try {
    await axios.delete(`/ppc/${proCode}`);
    this.products.splice(this.currentIndex, 1); // 목록에서 해당 아이템을 제거
    alert('상품이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('상품 삭제에 실패했습니다.');
  }
  this.isModalVisible = false;
}
,
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* 여기에 필요한 스타일을 추가하세요. */
</style>
