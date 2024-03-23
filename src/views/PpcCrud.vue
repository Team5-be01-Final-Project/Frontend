<template>
  <div class="product-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">거래처별 판매상품 목록</h3>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <VaSelect
          v-model="selectedClient"
          placeholder="거래처 선택"
          :options="clients"
          value-by="clientCode"
          label-by="clientName"
          searchable
        />

        <VaSelect
          v-model="selectedProduct"
          placeholder="제품 선택"
          :options="products"
          value-by="proCode"
          label-by="proName"
          searchable
        />

        <VaInput v-model="salePrice" placeholder="판매가" class="w-full" />
        <VaButton @click="registerSale" preset="primary">등록</VaButton>
      </div>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>#</th>
            <th>거래처명</th>
            <th>담당영업사원</th>
            <th>품목기준코드</th>
            <th>제품명</th>
            <th>단가</th>
            <th>판매가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedProducts" :key="index">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ item.clientName }}</td>
            <td>{{ item.empName }}</td>
            <td>{{ item.proCode }}</td>
            <td>{{ item.proName }}</td>
            <td>{{ item.proUnit }}</td>
            <td>{{ item.ppcSale }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
        <VaButton class="mr-6 mb-2" preset="secondary" hover-behavior="opacity" :hover-opacity="0.4">{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VaButton, VaInput, VaSelect } from 'vuestic-ui';

export default {
  data() {
    return {
      clients: [],
      products: [],
      selectedClient: null,
      selectedProduct: null,
      salePrice: '',
      currentPage: 1,
      perPage: 20,
    };
  },
  computed: {
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.products.slice(startIndex, endIndex).map(item => ({
        ...item,
        proName: item.product.proName,
        proUnit: item.product.proUnit,
      }));
    },
    pageCount() {
      return Math.ceil(this.products.length / this.perPage);
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/ppc/data');
        const data = response.data;
        this.clients = data.clients;
        this.products = data.products;
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    },
    async registerSale() {
      try {
        if (!this.selectedClient || !this.selectedProduct || !this.salePrice) {
          alert('거래처, 제품 및 판매가를 모두 선택해야 합니다.');
          return;
        }

        // 판매 등록 요청
        const response = await axios.post(`/ppc/${this.selectedProduct.proCode}`, {
          ppcSale: this.salePrice
        }, {
          headers: {
            clientCode: this.selectedClient.clientCode
          }
        });

        // 성공적으로 등록된 경우
        this.products.push(response.data);
        alert('판매가가 성공적으로 등록되었습니다.');
      } catch (error) {
        // 실패한 경우
        console.error('판매가 등록 실패:', error);
        alert('판매가 등록에 실패했습니다.');
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
  },
  created() {
    this.fetchData();
  }
};
</script>
