<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar/>
    </div>

    <!-- 제품 목록 섹션 -->
    <div class="product-list">
      <div class="va-table-responsive">
        <h3 class="va-h3">거래처별 판매상품 목록</h3>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <VaSelect
            v-model="selectedField"
            placeholder="필터링할 필드 선택"
            :options="filterOptions"
          />
          <VaInput v-model="filter" placeholder="필터링..." class="w-full" />
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
              <td>{{ item.proName }}</td>
              <td>{{ item.proSeg }}</td>
              <td>{{ item.proCat }}</td>
              <td>{{ item.ppcSale }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 페이지네이션 -->
        <div class="pagination">
          <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
          <VaButton class="mr-6 mb-2" preset="secondary" hover-behavior="opacity" :hover-opacity="0.4">
            {{ currentPage }}
          </VaButton>
          <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VaButton, VaSelect, VaInput } from 'vuestic-ui';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';

export default {
  components: {
    ProductSidebar,
    VaButton,
    VaSelect,
    VaInput
  },
  data() {
    return {
      products: [],
      filter: '',
      selectedField: '',
      currentPage: 1,
      perPage: 10,
      filterOptions: [
        { text: '거래처명', value: 'clientName' },
        { text: '제품명', value: 'proName' },
        { text: '분류', value: 'proCat' }
      ]
    };
  },
  computed: {
    filteredProducts() {
      if (!this.filter || !this.selectedField) return this.products;
      return this.products.filter(product =>
        product[this.selectedField].toString().toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
    pageCount() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('/ppc/all'); // 백엔드 엔드포인트의 실제 URL로 대체
        this.products = response.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.flex { display: flex; }
.sidebar { width: 250px; /* 사이드바 너비 조절 */ }
.va-table-responsive { overflow: auto; }
.pagination { margin-top: 20px; }
.pagination button { cursor: pointer; padding: 5px 10px; margin-right: 5px; }
.product-list { flex-grow: 1; /* 남은 공간 차지 */ }
</style>
