<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">출고전표 결재</h3>
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
          <tr v-for="(voucherGroup, index) in uniqueVouchers" :key="index">
            <td @click="navigateToDetail(voucherGroup[0].voucId)" class="clickable">{{ voucherGroup[0].voucId }}</td>
            <td>{{ voucherGroup[0].empName }}</td>
            <td>{{ voucherGroup[0].clientName }}</td>
            <td>{{ voucherGroup[0].voucDate }}</td>
            <td>{{ voucherGroup[0].signerName }}</td>
            <td>
              <template v-if="voucherGroup[0].approvalStatus.trim() === '대기중'">
                <VaBadge text="대기중" color="secondary" class="mr-2" />
              </template>
              <template v-if="voucherGroup[0].approvalStatus.trim() === '승인'">
                <VaBadge text="승인" color="success" class="mr-2" />
              </template>
              <template v-if="voucherGroup[0].approvalStatus.trim() === '반려'">
                <VaBadge text="반려" color="danger" class="mr-2" />
              </template>
            </td>
            <td>{{ voucherGroup[0].voucApproval }}</td>
          </tr>
        </tbody>
      </table>
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
      userDeptCode: '', // 사용자의 부서 코드를 저장할 변수
    };
  },
  computed: {
    filteredVouchers() {
      return this.vouchers.filter(voucher => voucher.deptCode === this.userDeptCode);
    },
    uniqueVouchers() {
      const unique = {};
      this.filteredVouchers.forEach(voucher => {
        if (!unique[voucher.voucId]) {
          unique[voucher.voucId] = [];
        }
        unique[voucher.voucId].push(voucher);
      });
      return Object.values(unique);
    },
  },
  mounted() {
    this.fetchUserDeptCode(); // 사용자의 부서 코드를 가져오는 함수 호출
  },
  methods: {
    async fetchUserDeptCode() {
      try {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
        const deptCodeCookie = cookies.find(cookie => cookie[0] === 'deptCode');
        if (deptCodeCookie) {
          this.userDeptCode = deptCodeCookie[1];
          await this.fetchVouchers(); // 출고전표 조회 함수 호출
        } else {
          console.error('Department code cookie not found.');
        }
      } catch (error) {
        console.error('Error fetching user dept code:', error);
      }
    },

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
