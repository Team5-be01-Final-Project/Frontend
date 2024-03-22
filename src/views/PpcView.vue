<template>
  <div class="product-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">거래처별 판매상품 목록</h3>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <VaSelect
          v-model="selectedField"
          placeholder="Select filter fields"
          :options="[
            { text: '거래처명', value: 'clientName' },
            { text: '품목기준코드', value: 'proCode' },
            { text: '제품명', value: 'product.proName' },
            { text: '분류', value: 'product.proCat' }
          ]"
          value-by="value"
        />
        <VaInput
          v-model="filter"
          placeholder="Filter..."
          class="w-full"
        />
      </div>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>#</th>
            <th>거래처명</th>
            <th>품목기준코드</th>
            <th>제품명</th>
            <th>품목 구분</th>
            <th>분류</th>
            <th>판매 가격</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedProducts" :key="index">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ item.clientName }}</td>
            <td>{{ item.proCode }}</td>
            <td>{{ item.product.proName }}</td>
            <td>{{ item.product.proSeg }}</td>
            <td>{{ item.product.proCat }}</td>
            <td>{{ item.ppcSale }}</td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>

<script>
import axios from 'axios';
import { VaButton } from 'vuestic-ui/web-components';

export default {

  data() {
    return {
      products: [],
      filter: '',
      selectedField: null,
      currentPage: 1,
      perPage: 20,
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;
      if (this.filter.trim() && this.selectedField) {
        filtered = this.products.filter(item => {
          const value = this.getValue(item, this.selectedField);
          return value.toLowerCase().includes(this.filter.trim().toLowerCase());
        });
      }
      return filtered;
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredProducts.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8081/clients/212-82-07728/products/all');
        this.products = response.data;
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    },
    getValue(item, field) {
      return field.split('.').reduce((obj, key) => obj[key], item);
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
    }
  },
  created() {
    this.fetchProducts();
  }
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
