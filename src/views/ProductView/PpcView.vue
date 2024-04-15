<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <!-- 제품 목록 섹션 -->
    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">거래처별 판매제품 목록</h3>
        <div class="filter">
          <VaSelect v-model="selectedField" placeholder="검색 조건" :options="filterOptions" style="margin-right: 5px;" />
          <VaInput v-model="filter" placeholder="검색어 입력" class="w-full" style="margin-right: 5px;" />
          <VaButton @click="applyFilter">검색</VaButton>
        </div>
        <div class="right-align">단위 : 원</div>
        <table class="va-table va-table--hoverable full-width">
          <thead>
            <tr>
              <th>NO.</th>
              <th>거래처명</th>
              <th>품목기준코드</th>
              <th>제품명</th>
              <th>품목 구분</th>
              <th>분류</th>
              <th>판매가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedProducts" :key="index">
              <td class='index-center'>{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td>{{ item.clientName }}</td>
              <td style="text-align: center;">{{ item.proCode }}</td>
              <td>{{ item.proName }}</td>
              <td style="text-align: center;">{{ item.proSeg }}</td>
              <td>{{ item.proCat }}</td>
              <td class='money-right'>{{ formatNumberWithCommas(item.ppcSale) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 -->
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
import axios from 'axios';
import { VaButton, VaSelect, VaInput } from 'vuestic-ui';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';
import formatNumberWithCommas from '@/utils/formatNumberWithCommas.js';

export default {
  components: {
    ProductSidebar,
    VaButton,
    VaSelect,
    VaInput,
  },
  data() {
    return {
      // 초기 데이터 설정
      products: [],
      filteredProducts: [],
      filter: '',
      selectedField: '전체', // '전체' 선택을 위한 'all' 값으로 초기화
      currentPage: 1,
      perPage: 20,
      // 필터 옵션
      filterOptions: [
        { text: '전체', value: 'all' },
        { text: '거래처명', value: 'clientName' },
        { text: '제품명', value: 'proName' },
        { text: '분류', value: 'proCat' },
      ],
    };
  },
  // 계산된 속성, 메서드 등...
  watch: {
    // selectedField의 값이 변경될 때 실행될 함수
    selectedField(newVal) {
      if (newVal.text === '전체') {
        // "전체"가 선택되면 검색 필드를 초기화
        this.filter = '';
      }
    }
  },
  computed: {
    // 페이징 처리를 위한 계산 속성
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
    pageCount() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
  },
  methods: {
    formatNumberWithCommas,
    async fetchProducts() {
      // 제품 데이터를 불러오는 메서드
      try {
        const response = await axios.get('/ppc/all'); // API 호출
        this.products = response.data;
        this.filteredProducts = response.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    applyFilter() {
      // 로그를 추가하여 현재 필터링 상태를 확인
      //console.log(`Selected Field: ${this.selectedField}, Filter: ${this.filter}`);

      if (this.selectedField.value === 'all' || !this.filter.trim()) {
        // "전체"가 선택되었거나 검색어가 비어있는 경우, 모든 제품을 표시
        this.filteredProducts = this.products;
      } else {
        // 선택된 필드에 따라 필터링
        this.filteredProducts = this.products.filter(product => {
          const fieldValue = product[this.selectedField.value]?.toString().toLowerCase() || '';
          return fieldValue.includes(this.filter.toLowerCase());
        });
      }
      this.currentPage = 1; // 필터링 후 페이지를 처음으로 설정
    },
    nextPage() {
      // 다음 페이지로 이동
      if (this.currentPage < this.pageCount) this.currentPage++;
    },
    prevPage() {
      // 이전 페이지로 이동
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  created() {
    this.fetchProducts(); // 컴포넌트 생성 시 제품 데이터 로드
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
</style>