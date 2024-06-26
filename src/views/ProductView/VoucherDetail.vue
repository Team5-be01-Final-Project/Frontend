<!-- VoucherDetail.vue -->
<template>
  <div class="flex">
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div>
      <div class="header">
        <h3 class="va-h3">전표 결재</h3>
        <div class="button-container" v-if="showApproveButton || showRejectButton">
          <button v-if="showApproveButton" @click="approveVoucherDetails" class="approve-button">승인</button>
          <button v-if="showRejectButton" @click="rejectVoucherDetails" class="reject-button">반려</button>
        </div>
      </div>
      <div class="spacer" style="height: 20px"></div>
      <div class="voucher-info">
        <div class="voucher-info-row">
          <div class="voucher-info-item"><span class="voucher-info-label">전표번호 : </span>
            <span class="voucher-info-value">{{ voucId }}</span>
          </div>
          <div class="voucher-info-item"><span class="voucher-info-label">등록일 : </span>
            <span class="voucher-info-value">{{ voucDate }}</span>
          </div>
          <div class="voucher-info-item"><span class="voucher-info-label">담당자 : </span>
            <span class="voucher-info-value">{{ empName }}</span>
          </div>
          <div class="voucher-info-item"><span class="voucher-info-label">결재자 : </span>
            <span class="voucher-info-value">{{ signerName }}</span>
          </div>
          <div class="voucher-info-item"><span class="voucher-info-label">거래처 : </span>
            <span class="voucher-info-value">{{ clientName }}</span>
          </div>
        </div>
      </div>
      <hr />
      <div class="spacer" style="height: 20px"></div>
      <div v-if="voucherDetails.length > 0">
        <table class="va-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>품목코드</th>
              <th>제품명</th>
              <th>수량</th>
              <th>판매가</th>
              <th>매출액</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in voucherDetails" :key="index">
              <td class='index-center'>{{ index + 1 }}</td>
              <td class='index-center'>{{ detail.proCode }}</td>
              <td>{{ detail.proName }}</td>
              <td class='money-right'>{{ detail.voucAmount }}</td>
              <td class='money-right'>{{ detail.voucSale.toLocaleString() }}</td>
              <td class='money-right'>{{ detail.voucSales.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div class="total-sales">총 합계(매출액): {{ totalVoucSales.toLocaleString() }}원</div>
     <!-- 비고 섹션의 조건부 렌더링 -->
     <div class="remarks">
          <textarea v-model="remarks" :readonly="appCode !== 'A00'" placeholder="비고 입력" rows="3" class="remarks-textarea"></textarea>
        </div>
  </div>
      <p v-else>해당 전표번호에 대한 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import ProductSidebar from "@/components/sidebar/ProductSidebar.vue";

export default {
  components: { ProductSidebar },
  data() {
    return {
      voucId: "",
      voucDate: "",
      empName: "",
      signerName: "",
      clientName: "",
      voucherDetails: [],
      showApproveButton: false,
      showRejectButton: false,
      proCode: null,
      remarks: "",
      appCode: "",  // 추가된 appCode 데이터 프로퍼티
    };
  },
  mounted() {
    this.fetchVoucherDetails();
  },
  computed: {
    totalVoucSales() {
      return this.voucherDetails.reduce(
        (total, detail) => total + (detail.voucSales || 0),
        0
      );
    },
    isButtonsEnabled() {
      const userEmpName = Cookies.get("empName");
      return userEmpName === this.signerName;
    },
  },
  methods: {
    async fetchVoucherDetails() {
      try {
        const response = await axios.get(`/vouchers/${this.$route.params.voucherID}/details`);

        this.voucherDetails = response.data;
        if (this.voucherDetails.length > 0) {
          const firstDetail = this.voucherDetails[0];
          this.voucId = firstDetail.voucId;
          this.voucDate = firstDetail.voucDate;
          this.empName = firstDetail.empName;
          this.signerName = firstDetail.signerName;
          this.clientName = firstDetail.clientName;
          this.proCode = firstDetail.proCode;
          this.showApproveButton =
            firstDetail.showApproveButton && this.isButtonsEnabled;
          this.showRejectButton =
            firstDetail.showRejectButton && this.isButtonsEnabled;
            this.approvalStatus = firstDetail.approvalStatus; // 서버에서 승인 상태 데이터를 받아옴
            this.remarks = firstDetail.voucNote || ""; // 비고 데이터 할당
            this.appCode = firstDetail.appCode; // 승인 코드 설정
        }
      } catch (error) {
        console.error("Error fetching voucher details:", error);
      }
    },
    async approveVoucherDetails() {
        if (!this.voucId) {
            console.error("voucId is required for approving voucher details.");
            return;
        }

        const payload = {
            remarks: this.remarks,
        };

        await axios.put(`/vouchers/${this.voucId}/approve/details`, payload)
            .then(() => {
                console.log("Voucher details approved successfully");
                this.fetchVoucherDetails();
                this.$router.push('/product/voucherapproval');
            })
            .catch(error => {
                console.error("Error approving voucher details:", error);
            });
    },

    async rejectVoucherDetails() {
        if (!this.voucId) {
            console.error("voucId is required for rejecting voucher details.");
            return;
        }

        const payload = {
            remarks: this.remarks,
        };

        await axios.put(`/vouchers/${this.voucId}/reject/details`, payload)
            .then(() => {
                console.log("Voucher details rejected successfully");
                this.fetchVoucherDetails();
                this.$router.push('/product/voucherapproval');
            })
            .catch(error => {
                console.error("Error rejecting voucher details:", error);
            });
    },
},
}
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
.reject-button,
.reject-details-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.approve-button {
  background-color: #4CAF50;
  color: white;
}

.reject-button,
.reject-details-button {
  background-color: #F44336;
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
  border-bottom: 1px solid #ddd;
}


.va-table tr:hover {
  background-color: #f5f5f5;
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

.remarks-textarea {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
    border: 1px solid #cccccc;
    font-size: 14px;
    resize: none;
    background-color: #ffffff;
  }
</style>