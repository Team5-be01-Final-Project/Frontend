<!-- ViewVoucher.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션: 제품 관련 사이드바 컴포넌트를 표시합니다. -->
    <div class="sidebar">
      <ProductSidebar />
    </div>
    <!-- 메인 컨텐츠 섹션 -->
    <div class="Main">
      <h3 class="va-h3">전표 조회</h3>
      <!-- 검색 폼: 사용자가 출고전표를 필터링할 수 있는 입력 필드와 버튼을 제공합니다. -->
      <div class="grid grid-cols-12 gap-4 mb-6 items-center" style="margin-bottom: 25px">
        <VaSelect v-model="selectedStatus" placeholder="결재 상태" :options="statusOptions" value-by="value"
          class="col-span-2 filter-select" style="margin-right: 5px" />
        <VaSelect v-model="selectedField" placeholder="검색 조건" :options="filterOptions" value-by="value"
          class="col-span-4 filter-select" style="margin-right: 5px" />
        <VaInput v-model="filter" placeholder="검색어 입력" class="col-span-6 search-input" style="margin-right: 5px" />
        <VaButton @click="searchVouchers" class="search-button col-span-2">검색</VaButton>
        <refresh-button class="left-margin" />

      </div>
      <!-- 출고전표 목록 테이블: 필터링된 출고전표 목록을 표시합니다. -->
      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th class="text-left" @click="sort('voucId')">
              전표번호
              <span>{{ currentSort === 'voucId' ? (currentSortDir === 'asc' ? '▲' : '▼') : '▼' }}</span>
            </th>
            <th class="text-left">담당자</th>
            <th class="text-left">거래처명</th>
            <th class="text-left">결재자</th>
            <th class="text-left">결재상태</th>
            <th class="text-left" @click="sort('voucApproval')">
              결재일
              <span>{{ currentSort === 'voucApproval' ? (currentSortDir === 'asc' ? '▲' : '▼') : '▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- v-for 디렉티브를 사용하여 displayedVouchers 배열을 반복하여 테이블 행을 생성합니다. -->
          <tr v-for="voucher in displayedVouchers" :key="voucher.voucId">
            <td style="text-align: center">{{ voucher.voucId }}</td>
            <td style="text-align: center">{{ voucher.empName }}</td>
            <td>{{ voucher.clientName }}</td>
            <td style="text-align: center">{{ voucher.signerName }}</td>
            <td style="text-align: center">
              <!-- 결재상태에 따라 다른 색상의 배지를 표시합니다. -->
              <template v-if="voucher.approvalStatus.trim() === '대기중'">
                <VaBadge text="대기중" color="secondary" class="mr-2" />
              </template>
              <template v-if="voucher.approvalStatus.trim() === '승인'">
                <VaBadge text="승인" color="success" class="mr-2" />
              </template>
              <template v-if="voucher.approvalStatus.trim() === '반려'">
                <VaBadge text="반려" color="danger" class="mr-2" />
              </template>
            </td>
            <td style="text-align: center">{{ voucher.voucApproval }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 페이지네이션: 사용자가 페이지를 이동할 수 있는 컨트롤을 제공합니다. -->
      <div class="pagination">
        <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
        <VaButton disabled>{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VaSelect, VaInput, VaButton, VaBadge } from "vuestic-ui";
import ProductSidebar from "@/components/sidebar/ProductSidebar.vue";
import RefreshButton from "@/components/RefreshButton.vue";

export default {
  components: {
    ProductSidebar,
    VaSelect,
    VaInput,
    VaButton,
    VaBadge,
    RefreshButton,
  },
  data() {
    return {
      vouchers: [], // 출고전표 목록을 저장할 배열
      currentPage: 1, // 현재 페이지 번호
      perPage: 20, // 페이지당 출고전표 개수
      selectedField: null, // 사용자가 선택한 필터링 필드를 저장하는 변수
      filter: "", // 사용자가 입력한 검색어를 저장하는 변수
      currentSort: 'voucId', // 현재 정렬 기준 컬럼
      currentSortDir: 'asc', // 현재 정렬 방향
      filterOptions: [
        // 필터링 옵션 목록
        { text: "전표번호", value: "voucId" },
        { text: "담당자", value: "empName" },
        { text: "거래처명", value: "clientName" },
        { text: "결재자", value: "signerName" },
      ],
      statusOptions: [ // 상태 필터 옵션 추가
        { text: "전체", value: null },
        { text: "대기중", value: "대기중" },
        { text: "승인", value: "승인" },
        { text: "반려", value: "반려" },
      ],
      selectedStatus: ""
    };
  },
  computed: {
    uniqueVouchers() {
      // 중복된 출고전표를 제거하고 유일한 출고전표만 반환합니다.
      const unique = {};
      this.sortedVouchers.forEach((voucher) => {
        unique[voucher.voucId] = voucher;
      });
      return Object.values(unique);
    },
    displayedVouchers() {
      // 현재 페이지에 해당하는 출고전표만 반환합니다.
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.uniqueVouchers.slice(start, end);
    },
    pageCount() {
      // 전체 페이지 개수를 계산합니다.
      return Math.ceil(this.uniqueVouchers.length / this.perPage);
    },
    sortedVouchers() {
      return this.vouchers.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        let valueA = a[this.currentSort];
        let valueB = b[this.currentSort];

        // 날짜 데이터를 위한 처리
        if (this.currentSort === 'voucApproval') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        // 숫자 데이터를 위한 처리
        if (!isNaN(valueA) && !isNaN(valueB)) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        return valueA < valueB ? -1 * modifier : valueA > valueB ? 1 * modifier : 0;
      });
    },
    displayedVouchers() {
      // 현재 페이지에 해당하는 출고전표만 반환합니다.
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.sortedVouchers.slice(start, end);
    },
  },
  mounted() {
    // 컴포넌트가 마운트될 때 출고전표 목록을 조회합니다.
    this.fetchVouchers();
  },
  methods: {
    async fetchVouchers() {
      try {
        const response = await axios.get("/vouchers");
        const uniqueVouchers = new Map();
        response.data.forEach(voucher => {
          uniqueVouchers.set(voucher.voucId, voucher);
        });
        this.vouchers = Array.from(uniqueVouchers.values());
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    },
    prevPage() {
      // 이전 페이지로 이동하는 메서드입니다.
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      // 다음 페이지로 이동하는 메서드입니다.
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    async searchVouchers() {
      // 검색 조건에 맞는 출고전표를 조회하는 메서드입니다.
      try {
        const params = {};
        if (this.selectedField && this.filter) {
          params[this.selectedField] = this.filter;
        }
        const response = await axios.get("/vouchers/search", { params });
        this.vouchers = response.data;

        // 상태 필터는 프론트엔드에서 적용
        if (this.selectedStatus) {
          this.vouchers = this.vouchers.filter(voucher =>
            voucher.approvalStatus.trim() === this.selectedStatus
          );
        }

        this.currentPage = 1; // 검색 후 현재 페이지를 1로 초기화합니다.
      } catch (error) {
        console.error("Error searching vouchers:", error);
      }
    },
    sort(s) {
      // 이미 정렬 중인 컬럼을 다시 클릭하면 정렬 방향을 변경합니다.
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = s;
        this.currentSortDir = 'asc';
      }
      this.currentPage = 1; // 정렬 후 현재 페이지를 1로 초기화합니다.
    }
  },
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
  background-color: #DEE5F2;
  /* 짙은 파란색 배경 */
  font-weight: bold;
  /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc;
  /* 회색 테두리 */
  font-size: 15px;
}

.left-margin {
  margin-left: 5px;
}
</style>