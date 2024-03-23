<template>
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
    };
  },
  methods: {
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
