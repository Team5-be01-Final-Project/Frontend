<template>
  <div>
    <VaSelect
  v-model="selectedFilterField"
  placeholder="Select filter fields"
  :options="[
    { text: '거래처명', value: 'clientName' },
    { text: '제품명', value: 'product.proName' },
  ]"
  value-by="value"
/>

        <VaInput
          v-model="filter"
          placeholder="Filter..."
          class="w-full"
        />
    <div class="sales-registration">
      <h3>판매가 등록</h3>
      <VaSelect
    v-model="selectedClientCode"
    searchable
    placeholder="거래처 선택"
    :reduce="client => client.clientCode" 
    :options="clients.map(client => ({ text: client.clientName, value: client }))"
    class="mb-4" 
  />
      
  <VaSelect
  v-model="selectedProductCode"
  searchable
  placeholder="상품 선택"
  :options="products.map(product => ({ text: product.product.proName, value: product.proCode }))"
  class="mb-4"
/>

  <VaInput type="number" v-model="salePrice" placeholder="판매가 입력" />
      <VaButton
    color="info"
    class="mr-6 mb-2" @click="registerSale">등록</VaButton>
    </div>
    <div class="product-list">
      <div class="va-table-responsive">
        <h3 class="va-h3">모든 상품 목록</h3>
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th>#</th>
              <th>거래처명</th>
              <th>제품명</th>
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
                <VaButton
    color="warning"
    class="mr-6 mb-2"
 @click="showEditModal(product, index)">수정</VaButton>
              </td>
              <td>
                <VaButton
    color="danger"
    class="mr-6 mb-2" @click="showDeleteModal(product, index)">삭제</VaButton>
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
</template>

<script>
import axios from 'axios';
import Modal from '@/components/Modal.vue';
import { VaButton, VaSelect } from 'vuestic-ui/web-components';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      filter: '',
    selectedFilterField: 'clientName', 
      products: [],
      isModalVisible: false,
      currentItem: null,
      isEditing: false,
      currentIndex: null,
      currentPage: 1,
      perPage: 20,
      clients: [],
      selectedClientCode: '',
      selectedProductCode: '',
      salePrice: '',
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        let value = '';
        if (this.selectedFilterField === 'clientName') {
          value = product.clientName;
        } else if (this.selectedFilterField === 'product.proName') { // 제품명 필드 경로 수정
          value = product.product.proName;
        }
        return value.toLowerCase().includes(this.filter.toLowerCase());
      });
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredProducts.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.products.length / this.perPage);
    }
  },
  methods: {
    async registerSale() {
      if (!this.selectedClientCode || !this.selectedProductCode || !this.salePrice) {
        alert('모든 정보를 입력해주세요.');
        return;
      }
      const isAlreadyRegistered = await this.checkProductRegistration(this.selectedClientCode, this.selectedProductCode);
      if (isAlreadyRegistered) {
        alert('이미 해당 품목이 등록되어 있습니다.');
        return;
      }
      try {
        const response = await axios.post(`/ppc/${this.selectedProductCode}`, {
          clientCode: this.selectedClientCode,
          ppcSale: parseInt(this.salePrice, 10)
        });
        alert('판매가 성공적으로 등록되었습니다.');
        this.fetchProducts();
        this.selectedClientCode = '';
        this.selectedProductCode = '';
        this.salePrice = '';
      } catch (error) {
        console.error('판매 등록 중 오류 발생:', error);
        alert('해당거래처에 해당 상품이 존재합니다.');
      }
    },
    async checkProductRegistration(clientCode, productCode) {
      try {
        const response = await axios.get(`/ppc/${clientCode}/${productCode}/exists`);
        return response.data.exists;
      } catch (error) {
        console.error('Error checking product registration:', error);
        return false;
      }
    },
    async fetchClients() {
      try {
        const response = await axios.get('/clients/list');
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
         // 필터링된 제품 목록이 업데이트되도록 추가
         this.paginatedProducts;
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
        this.products[this.currentIndex] = item;
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

