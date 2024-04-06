<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <!-- 제품 목록 섹션 -->
    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">거래처별 판매상품 목록</h3>
        <div class="grid md:grid-cols-3 gap-6 mb-6">
          <VaSelect v-model="selectedField" placeholder="검색 조건" :options="filterOptions" />
          <VaInput v-model="filter" placeholder="검색어 입력" class="w-full" />
          <VaButton @click="applyFilter">검색</VaButton>
        </div>
        <table class="va-table va-table--hoverable full-width">
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
    VaInput,
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      filter: '',
      selectedField: '',
      currentPage: 1,
      perPage: 10,
      filterOptions: [
        { text: '거래처명', value: 'clientName' },
        { text: '제품명', value: 'proName' },
        { text: '분류', value: 'proCat' },
      ],
    };
  },
  computed: {
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
        this.filteredProducts = response.data; // 초기에는 모든 제품을 표시
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    applyFilter() {
      if (!this.filter || !this.selectedField) {
        // 검색어나 필터링 필드가 선택되지 않은 경우 전체 제품 목록을 보여줌
        this.filteredProducts = this.products;
      } else {
        // 선택된 필드와 검색어를 기준으로 제품 목록을 필터링
        this.filteredProducts = this.products.filter(product =>
          product[this.selectedField].toString().toLowerCase().includes(this.filter.toLowerCase())
        );
      }
      this.currentPage = 1; // 검색 후 현재 페이지를 1로 초기화
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
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바 너비 조절 */
}


.pagination {
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}
</style>