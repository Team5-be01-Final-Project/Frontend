<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">출고전표 목록 조회</h3>
      <table class="va-table va-table--hoverable full-width">
        <!-- 테이블의 width를 100%로 설정 -->
        <thead>
          <tr>
            <th class="text-left">전표번호</th>
            <th class="text-left">담당자</th>
            <th class="text-left">거래처명</th>
            <th class="text-left">등록일</th>
            <th class="text-left">결재자</th>
            <th class="text-left">결재상태</th>
            <th class="text-left">결재일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="voucher in displayedVouchers" :key="voucher.voucId">
            <td @click="navigateToDetail(voucher.voucId)" class="clickable">{{ voucher.voucId }}</td>
            <td>{{ voucher.empName }}</td>
            <td>{{ voucher.clientName }}</td>
            <td>{{ voucher.voucDate }}</td>
            <td>{{ voucher.signerName }}</td>
            <td>
              <template v-if="voucher.approvalStatus.trim() === '대기중'">
                <VaBadge text="대기중" color="secondary" class="mr-2" />
              </template>
              <template v-if="voucher.approvalStatus.trim() === '승인'">
                <VaBadge text="승인" color="success" class="mr-2" />
              </template>
              <template v-if="voucher.approvalStatus.trim() === '반려'">
                <VaBadge text="반려" color="danger" class="mr-2" />
              </template>
              <!-- {{ voucher.approvalStatus.trim() }} -->
            </td>
            <td>{{ voucher.voucApproval }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>Page {{ currentPage }} of {{ pageCount }}</span>
        <button @click="nextPage" :disabled="currentPage === pageCount">다음</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue'

export default {
  components: {
    ProductSidebar,
  },
  data() {
    return {
      vouchers: [],
      currentPage: 1,
      perPage: 20,
    };
  },
  computed: {
    uniqueVouchers() {
      const unique = {};
      this.vouchers.forEach(voucher => {
        unique[voucher.voucId] = voucher;
      });
      return Object.values(unique);
    },
    displayedVouchers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.uniqueVouchers.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.uniqueVouchers.length / this.perPage);
    }
  },
  mounted() {
    this.fetchVouchers();
  },
  methods: {
    async fetchVouchers() {
      try {
        const response = await axios.get('/api/vouchers');
        this.vouchers = response.data;
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    },
    navigateToDetail(voucId) {
      this.$router.push(`/product/voucherdetail/${voucId}`);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
}

.sidebar {
  width: 250px;
  /* 사이드바의 너비를 조절하세요 */
  /* 필요에 따라 추가 스타일링 */
}

.clickable {
  cursor: pointer;
  color: #2c3e50;
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
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
