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
            <th>판매가 입력</th>
            <th>수정</th> <!-- 레이블 변경 -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.proCode">
            <td>{{ index + 1 }}</td>
            <td>{{ product.clientName }}</td>
            <td>{{ product.product.proName }}</td>
            <td>
              <input type="number" v-model="product.ppcSale" placeholder="판매가 입력" />
            </td>
            <td>
              <!-- 수정 기능을 위한 버튼 이벤트 변경 -->
              <button @click="updateSale(product.proCode, product.ppcSale, product.clientCode)">수정</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
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
    async updateSale(proCode, ppcSale, clientCode) {
      try {
        // 기존 판매가 등록 로직을 수정 로직으로 변경
        const response = await axios.post(`/ppc/${proCode}`, { clientCode, ppcSale });
        alert(`판매가가 성공적으로 수정되었습니다: ${response.data.product.proName}`);
        // 상품 목록을 새로고침하여 수정된 정보를 반영
        this.fetchProducts();
      } catch (error) {
        console.error('Error updating sale price:', error);
        alert('판매가 수정에 실패했습니다.');
      }
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* 스타일은 여러분의 요구에 맞게 조정하세요 */
.va-table-responsive {
  overflow: auto;
}
</style>
