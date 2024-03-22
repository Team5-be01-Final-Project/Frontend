<template>
  <div class="product-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">제품 목록</h3>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <VaSelect
          v-model="selectedField"
          placeholder="Select filter fields"
          :options="[
            { text: '품목 기준 코드', value: 'proCode' },
            { text: '제품명', value: 'proName' },
            { text: '품목 구분', value: 'proSeg' },
            { text: '주성분', value: 'proIngre' },
            { text: 'ATC 코드', value: 'proAtc' }
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
            <th>No.</th>
            <th>품목기준코드</th>
            <th>제품명</th>
            <th>품목구분</th>
            <th>주성분</th>
            <th>ATC코드</th>
            <th>분류</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.proCode">
            <td>{{ index + 1 }}</td>
            <td>{{ product.proCode }}</td>
            <td>{{ product.proName }}</td>
            <td>{{ product.proSeg }}</td>
            <td>{{ product.proIngre }}</td>
            <td>{{ product.proAtc }}</td>
            <td>{{ product.proCat }}</td>
            <td>{{ product.proUnit }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>{{ currentPage }}</span>
        <button @click="nextPage" :disabled="currentPage === pageCount">다음</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [], // 모든 제품 목록
      filteredProducts: [], // 필터링된 제품 목록
      selectedField: null, // VaSelect에서 선택한 필드
      filter: '', // VaInput의 필터 값
      currentPage: 1, // 현재 페이지 번호
      perPage: 20, // 페이지당 표시할 항목 수
    };
  },
  computed: {
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredProducts.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    }
  },
  created() {
    this.fetchProductList();
  },
  watch: {
    filter() {
      // VaInput 필터 값이 변경될 때마다 필터링된 제품 목록을 업데이트
      this.filterProducts();
    }
  },
  methods: {
    async fetchProductList() {      
      try {
        const response = await this.axios.get('api/products');
        this.products = response.data;
        this.filterProducts(); // 페이지 로드 시 필터링된 제품 목록 업데이트
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    },
    filterProducts() {
      // 필터링된 제품 목록을 업데이트
      if (!this.filter) {
        // 필터 값이 없으면 모든 제품을 보여줌
        this.filteredProducts = this.products;
      } else {
        // 선택한 필드에 따라 제품을 필터링
        if (this.selectedField === 'proCode') {
          // 품목기준코드일 경우 정확히 일치하는 제품을 필터링
          this.filteredProducts = this.products.filter(product => {
            return product.proCode.includes(this.filter);
          });
        } else {
          this.filteredProducts = this.products.filter(product => {
            return product[this.selectedField] && product[this.selectedField].includes(this.filter);
          });
        }
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
    }
  }
};
</script>

<style>
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
