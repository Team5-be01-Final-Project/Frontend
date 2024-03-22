<template>
  <div class="product-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">거래처별 판매상품 목록</h3>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>거래처 코드</th>
            <th>거래처명</th> <!-- 추가 -->
            <th>상품 코드</th>
            <th>상품명</th>
            <th>품목 구분</th>
            <th>분류</th>
            <th>판매 가격</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products" :key="index">
            <td>{{ item.clientCode }}</td>
            <td>{{ item.clientName }}</td> <!-- 추가 -->
            <td>{{ item.proCode }}</td>
            <td>{{ item.product.proName }}</td>
            <td>{{ item.product.proSeg }}</td>
            <td>{{ item.product.proCat }}</td>
            <td>{{ item.ppcSale }}</td>
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
      products: []
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8081/clients/212-82-07728/products/all');
        this.products = response.data;
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    }
  }
};
</script>

<style scoped>
.va-table-responsive {
  overflow: auto;
}
</style>
