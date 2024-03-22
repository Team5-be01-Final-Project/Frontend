<template>
  <div class="product-list">
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <h1>제품 목록</h1>
      <table>
        <thead>
          <tr>
            <th>제품 코드</th>
            <th>제품 이름</th>
            <th>제품 분류</th>
            <th>제품 성분</th>
            <th>제품 ATC</th>
            <th>제품 카테고리</th>
            <th>제품 단위</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.proCode">
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
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === pageCount">다음</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      loading: true,
      currentPage: 1,
      perPage: 10, // 페이지당 표시할 항목 수
      pageCount: 0 // 전체 페이지 수
    };
  },
  created() {
    this.fetchProductList();
  },
  methods: {
    async fetchProductList() {
      try {
        const response = await axios.get(`http://localhost:8081/api/products?page=${this.currentPage}&size=${this.perPage}`);
        this.products = response.data.content;
        this.pageCount = response.data.totalPages;
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
        this.fetchProductList();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchProductList();
      }
    }
  }
};
</script>

<style>
/* 스타일링 */
</style>
