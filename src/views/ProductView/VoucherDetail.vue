<!-- VoucherDetail.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div>
      <div class="header">
        <h3 class="va-h3">출고전표 결재</h3>
        <div
          class="button-container"
          v-if="showApproveButton || showRejectButton"
        >
          <button
            v-if="showApproveButton"
            @click="approveVoucher"
            class="approve-button"
          >
            승인
          </button>
          <button
            v-if="showRejectButton"
            @click="rejectVoucher"
            class="reject-button"
          >
            반려
          </button>
        </div>
      </div>
      <div class="spacer" style="height: 20px"></div>
      <div class="voucher-info">
        <div class="voucher-info-row">
          <div class="voucher-info-item">
            <span class="voucher-info-label">전표번호:</span>
            <span class="voucher-info-value">{{ voucId }}</span>
          </div>
          <div class="voucher-info-item">
            <span class="voucher-info-label">등록일:</span>
            <span class="voucher-info-value">{{ voucDate }}</span>
          </div>
          <div class="voucher-info-item">
            <span class="voucher-info-label">담당자:</span>
            <span class="voucher-info-value">{{ empName }}</span>
          </div>
        </div>
        <div class="voucher-info-row">
          <div class="voucher-info-item">
            <span class="voucher-info-label">결재자:</span>
            <span class="voucher-info-value">{{ signerName }}</span>
          </div>
          <div class="voucher-info-item">
            <span class="voucher-info-label">거래처:</span>
            <span class="voucher-info-value">{{ clientName }}</span>
          </div>
          <div class="voucher-info-item">
            <span class="voucher-info-label">차량 번호:</span>
            <span class="voucher-info-value">{{ storageCar }}</span>
          </div>
        </div>
      </div>
      <hr />
      <div class="spacer" style="height: 20px"></div>
      <div v-if="voucherDetails.length > 0">
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th style="width: 10%">No.</th>
              <th style="width: 30%">제품명</th>
              <th style="width: 15%">수량</th>
              <th style="width: 20%">판매가</th>
              <th style="width: 25%">합계</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in voucherDetails" :key="detail.voucId">
              <td>{{ index + 1 }}</td>
              <td>{{ detail.proName }}</td>
              <td>{{ detail.voucAmount }}</td>
              <td>{{ detail.voucSale.toLocaleString() }}원</td>
              <td>{{ detail.voucSales.toLocaleString() }}원</td>
            </tr>
          </tbody>
        </table>
        <div class="total-sales">
          총합계 : {{ totalVoucSales.toLocaleString() }}원
        </div>
      </div>
      <p v-else>해당 전표번호에 대한 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VoucherApproval from "@/components/VoucherApproval.vue";
import ProductSidebar from "@/components/sidebar/ProductSidebar.vue";

export default {
  components: { VoucherApproval, ProductSidebar },
  data() {
    return {
      voucId: "",
      voucDate: "",
      empName: "",
      signerName: "",
      clientName: "",
      storageCar: "",
      voucherDetails: [],
      proCode: null,
      empCodeSign: null,
      showApproveButton: false,
      showRejectButton: false,
    };
  },
  mounted() {
    this.fetchVoucherDetails();
  },
  computed: {
    totalVoucSales() {
      return this.voucherDetails.reduce((total, detail) => {
        return total + (detail.voucSales || 0);
      }, 0);
    },
  },
  methods: {
    async fetchVoucherDetails() {
      try {
        const response = await axios.get(
          `/api/vouchers/${this.$route.params.voucherID}/details`
        );
        const data = response.data[0];
        this.voucId = data.voucId;
        this.voucDate = data.voucDate;
        this.empName = data.empName;
        this.signerName = data.signerName;
        this.clientName = data.clientName;
        this.storageCar = data.storageCar;
        this.voucherDetails = response.data;
        this.proCode = data.proCode;
        this.empCode = data.empCode;
        this.showApproveButton = data.showApproveButton;
        this.showRejectButton = data.showRejectButton;
        console.log("showApproveButton:", data.showApproveButton);
        console.log("showRejectButton:", data.showRejectButton);
      } catch (error) {
        console.error("Error fetching voucher details:", error);
      }
    },
    async approveVoucher() {
      try {
        const response = await axios.put(
          `/api/vouchers/${this.voucId}/approve`,
          {
            proCode: this.proCode,
            empCodeSign: this.loggedInUserEmpCode,
          }
        );
        console.log("Voucher approved");
        await this.fetchVoucherDetails();
      } catch (error) {
        console.error("Error approving voucher:", error);
      }
    },
    async rejectVoucher() {
      try {
        const response = await axios.put(
          `/api/vouchers/${this.voucId}/reject`,
          {
            proCode: this.proCode,
            empCodeSign: this.loggedInUserEmpCode,
          }
        );
        console.log("Voucher rejected");
        await this.fetchVoucherDetails(); // 데이터 갱신
      } catch (error) {
        console.error("Error rejecting voucher:", error);
      }
    },
  },
};
</script>

<style scoped>
.spacer {
  height: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  gap: 10px;
  z-index: 1;
}

.approve-button,
.reject-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.approve-button {
  background-color: #4caf50;
  color: white;
}

.reject-button {
  background-color: #f44336;
  color: white;
}

.voucher-info {
  margin-bottom: 20px;
}

.voucher-info-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.voucher-info-item {
  display: flex;
  gap: 5px;
}

.voucher-info-label {
  font-weight: bold;
}

.total-sales {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.va-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.va-table th,
.va-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.va-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.va-table tr:hover {
  background-color: #f5f5f5;
}
</style>