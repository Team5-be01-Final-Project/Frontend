<template>
    <div>
      <h3 class="va-h3">출고전표 목록 조회</h3>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th class="text-left">전표번호</th>
            <th class="text-left">담당자</th>
            <th class="text-left">거래처명</th>
            <th class="text-left">등록일</th>
            <th class="text-left">승인상태</th>
            <th class="text-left">결재자</th>
            <th class="text-left">결재일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="voucher in vouchers" :key="voucher.voucId">
            <td>{{ voucher.voucId }}</td>
            <td>{{ voucher.empName }}</td>
            <td>{{ voucher.clientName }}</td>
            <td>{{ voucher.voucDate  }}</td>
            <td>{{ voucher.approvalStatus }}</td>
            <td>{{ voucher.signerName }}</td>
            <td>{{ voucher.voucApproval }}</td>
            
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        vouchers: [], // 출고전표 목록을 담을 배열
      };
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
    },
    filters: {
      formatDate(value) {
        if (value) {
          return new Date(value).toLocaleDateString();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom styles here */
  </style>
  