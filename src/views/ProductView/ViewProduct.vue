<!-- ViewProduct.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <!-- 제품 목록 섹션 -->
    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">판매 제품 리스트 조회</h3>
        <div class="grid md:grid-cols-3 gap-6 mb-6">
          <VaSelect
            v-model="selectedField"
            placeholder="검색 조건"
            :options="[
              { text: '제품명', value: 'proName' },
              { text: '품목 구분', value: 'proSeg' },
              { text: '주성분', value: 'proIngre' },
              { text: 'ATC 코드', value: 'proAtc' },
            ]"
            value-by="value" style="margin-right: 5px;"
          />
          <VaInput v-model="filter" placeholder="검색어 입력" class="w-full" style="margin-right: 5px;" />
          <VaButton @click="filterProducts">검색</VaButton>
          <refresh-button class="left-margin"/>
        </div>
        <div class="right-align">단위 : 원</div>
        <table class="va-table va-table--hoverable full-width">
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
            <tr
              v-for="(product, index) in paginatedProducts"
              :key="product.proCode"
            >
              <td class="index-center">{{ getPageNumber(index) }}</td>
              <td style="text-align: center;">{{ product.proCode }}</td>
              <td>{{ product.proName }}</td>
              <td style="text-align: center;">{{ product.proSeg }}</td>
              <td>{{ product.proIngre }}</td>
              <td>{{ product.proAtc }}</td>
              <td>{{ product.proCat }}</td>
              <td class="money-right" v-if="isAuthorized">
                {{ formatNumberWithCommas(product.proUnit) }}
              </td>
              <td class="money-right" v-else>-</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
          <VaButton disabled>{{ currentPage }}</VaButton>
          <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VaButton } from "vuestic-ui/web-components";
import ProductSidebar from "@/components/sidebar/ProductSidebar.vue";
import NavigationBar from "@/components/navbar/NavigationBar.vue";
import formatNumberWithCommas from "@/utils/formatNumberWithCommas.js";
import Cookies from "js-cookie";
import RefreshButton from '@/components/RefreshButton.vue';

export default {
  components: {
    ProductSidebar,
    NavigationBar,
    RefreshButton,
  },
  data() {
    return {
      products: [], // 모든 제품 목록
      filteredProducts: [], // 필터링된 제품 목록
      selectedField: null, // VaSelect에서 선택한 필드
      filter: "", // VaInput의 필터 값
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
    },
    isAuthorized() {
      const userRole = Cookies.get("empAuthCode");
      return ['AUTH001', 'AUTH002', 'AUTH003'].includes(userRole); // 여러 권한 확인
    },
  },
  created() {
    this.fetchProductList();
  },
  methods: {
    formatNumberWithCommas,
    async fetchProductList() {
      try {
        const response = await this.axios.get("/products");
        this.products = response.data;
        this.filteredProducts = response.data; // 초기에는 모든 제품 목록을 filteredProducts에 할당
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    },
    filterProducts() {
      // 필터링된 제품 목록을 업데이트
      if (!this.filter) {
        // 필터 값이 없으면 모든 제품을 보여줌
        this.filteredProducts = this.products;
      } else {
        // 선택한 필드에 따라 제품을 필터링
        this.filteredProducts = this.products.filter((product) => {
          return (
            product[this.selectedField] &&
            product[this.selectedField]
              .toLowerCase()
              .includes(this.filter.toLowerCase())
          );
        });
      }
      this.currentPage = 1; // 필터링 후 현재 페이지를 1로 초기화
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
    // 각 제품의 번호를 계산하는 함수
    getPageNumber(index) {
      return (this.currentPage - 1) * this.perPage + index + 1;
    },
  },
};
</script>

<style>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바의 고정 너비 */
  /* 추가적으로 필요한 스타일링이 있다면 여기에 추가하세요 */
}

.pagination {
  display: flex;
  justify-content: center;
  /* 페이지네이션 버튼을 중앙에 위치시키기 */
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

.sidebar {
  width: 250px;
  margin: 0;
  /* 사이드바의 마진 제거 */
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

.va-table thead th {
  background-color: #DEE5F2; /* 짙은 파란색 배경 */
  font-weight: bold; /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc; /* 회색 테두리 */
  font-size: 15px;
}

.left-margin{
  margin-left: 5px;
}
</style>