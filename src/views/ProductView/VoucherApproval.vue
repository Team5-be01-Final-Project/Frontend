<!-- VoucherApproval.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션: 제품 관련 사이드바 컴포넌트를 포함합니다. -->
    <div class="sidebar">
      <ProductSidebar />
    </div>
    <!-- 메인 컨텐츠 섹션 -->
    <div class="Main">
      <h3 class="va-h3">출고전표 결재 목록</h3>
      <!-- 검색 폼: 사용자가 결재 목록을 필터링할 수 있게 합니다. -->
      <div class="grid grid-cols-12 gap-4 mb-6 items-center">
        <VaSelect v-model="selectedField" placeholder="검색 조건 선택" :options="filterOptions" value-by="value"
          class="col-span-4 filter-select" />
        <VaInput v-model="filter" placeholder="검색어 입력" class="col-span-6 search-input" />
        <VaButton @click="searchVouchers" class="search-button col-span-2">검색</VaButton>
      </div>
      <!-- 출고전표 결재 목록 테이블 -->
      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th class="text-left">전표번호</th>
            <th class="text-left">담당자</th>
            <th class="text-left">거래처명</th>
            <th class="text-left">등록일</th>
            <th class="text-left">결재상태</th>
            <th class="text-left">총 합계</th>
          </tr>
        </thead>
        <tbody>
          <!-- 대기중인 출고전표 목록 출력 -->
          <tr v-for="(voucherGroup, index) in waitingVouchers" :key="'waiting-' + index">
            <td @click="navigateToDetail(voucherGroup[0].voucId)" class="clickable">{{ voucherGroup[0].voucId }}</td>
            <td>{{ voucherGroup[0].empName }}</td>
            <td>{{ voucherGroup[0].clientName }}</td>
            <td>{{ voucherGroup[0].voucDate }}</td>
            <td>
              <VaBadge text="대기중" color="secondary" class="mr-2" />
            </td>
            <td>{{ formatNumberWithCommas(voucherGroup[0].voucSales) }}</td>
          </tr>
          <!-- 승인된 출고전표 목록 출력 -->
          <tr v-for="(voucherGroup, index) in approvedVouchers" :key="'approved-' + index">
            <td @click="navigateToDetail(voucherGroup[0].voucId)" class="clickable">{{ voucherGroup[0].voucId }}</td>
            <td>{{ voucherGroup[0].empName }}</td>
            <td>{{ voucherGroup[0].clientName }}</td>
            <td>{{ voucherGroup[0].voucDate }}</td>
            <td>
              <VaBadge text="승인" color="success" class="mr-2" />
            </td>
            <td>{{ formatNumberWithCommas(voucherGroup[0].voucSales) }}</td>
          </tr>
          <!-- 반려된 출고전표 목록 출력 -->
          <tr v-for="(voucherGroup, index) in rejectedVouchers" :key="'rejected-' + index">
            <td @click="navigateToDetail(voucherGroup[0].voucId)" class="clickable">{{ voucherGroup[0].voucId }}</td>
            <td>{{ voucherGroup[0].empName }}</td>
            <td>{{ voucherGroup[0].clientName }}</td>
            <td>{{ voucherGroup[0].voucDate }}</td>
            <td>
              <VaBadge text="반려" color="danger" class="mr-2" />
            </td>
            <td>{{ formatNumberWithCommas(voucherGroup[0].voucSales) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VaSelect, VaInput, VaButton, VaBadge } from 'vuestic-ui';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';
import formatNumberWithCommas from '@/utils/formatNumberWithCommas';

export default {
  components: {
    ProductSidebar,
    VaSelect,
    VaInput,
    VaButton,
    VaBadge,
  },
  data() {
    return {
      vouchers: [], // 조회된 전체 출고전표 목록
      userDeptCode: '', // 현재 사용자의 부서 코드
      selectedField: null, // 선택된 검색 조건
      filter: '', // 입력된 검색어
      filterOptions: [
        // 검색 필터 옵션
        { text: '전표번호', value: 'voucId' },
        { text: '담당자', value: 'empName' },
        { text: '거래처명', value: 'clientName' },
        { text: '결재상태', value: 'approvalStatus' },
      ],
    };
  },
  computed: {
    filteredVouchers() {
      // 사용자 부서 코드에 따라 필터링된 출고전표 목록 반환
      return this.vouchers.filter(voucher => voucher.deptCode === this.userDeptCode);
    },
    uniqueVouchers() {
      // 중복 제거된 유니크 출고전표 목록 생성
      const unique = {};
      this.filteredVouchers.forEach(voucher => {
        if (!unique[voucher.voucId]) {
          unique[voucher.voucId] = [];
        }
        unique[voucher.voucId].push(voucher);
      });
      return Object.values(unique);
    },
    waitingVouchers() {
      // 대기중인 출고전표 목록 반환
      return this.uniqueVouchers.filter(voucherGroup => voucherGroup[0].approvalStatus.trim() === '대기중');
    },
    approvedVouchers() {
      // 승인된 출고전표 목록 반환
      return this.uniqueVouchers.filter(voucherGroup => voucherGroup[0].approvalStatus.trim() === '승인');
    },
    rejectedVouchers() {
      // 반려된 출고전표 목록 반환
      return this.uniqueVouchers.filter(voucherGroup => voucherGroup[0].approvalStatus.trim() === '반려');
    },
  },
  mounted() {
    this.fetchUserDeptCode(); // 컴포넌트 마운트 시 사용자 부서 코드 조회
  },
  methods: {
    formatNumberWithCommas,
    async fetchUserDeptCode() {
      // 사용자의 부서 코드를 쿠키에서 조회하는 메소드
      try {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const deptCodeCookie = cookies.find(cookie => cookie[0] === 'deptCode');
        if (deptCodeCookie) {
          this.userDeptCode = deptCodeCookie[1];
          await this.fetchVouchers(); // 부서 코드 확인 후 출고전표 조회
        } else {
          console.error('Department code cookie not found.');
        }
      } catch (error) {
        console.error('Error fetching user dept code:', error);
      }
    },
    async fetchVouchers() {
      // 서버에서 출고전표 목록 조회
      try {
        const response = await axios.get('/vouchers');
        this.vouchers = response.data;
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    },
    navigateToDetail(voucId) {
      // 상세 페이지로 네비게이션
      this.$router.push(`/product/voucherdetail/${voucId}`);
    },
    async searchVouchers() {
      // 사용자가 입력한 조건으로 출고전표 검색
      try {
        const params = {};
        if (this.selectedField && this.filter) {
          params[this.selectedField] = this.filter;
        }
        const response = await axios.get('/vouchers/search', { params });
        this.vouchers = response.data;
      } catch (error) {
        console.error('Error searching vouchers:', error);
      }
    },
    
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