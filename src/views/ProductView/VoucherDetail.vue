<template>
    <div>
      <h3 class="va-h3">출고전표 결재</h3>
      <div class="col-span-1" style="height: px;"></div>
      <thead>
          <p>전표번호 : {{ voucId }}  |  등록일 : {{ voucDate }}  |  담당자 : {{ empName }}  </p> 
          <p>결재자 : {{ signerName }} | 거래처 : {{ clientName }} | 차량 번호 : {{ storageCar }}</p>
      </thead>
      <div class="col-span-1" style="height: 20px;"></div>
      <hr>
      <div class="col-span-1" style="height: 20px;"></div>
      <div v-if="voucherDetails && voucherDetails.length">
        <table class="va-table va-table--hoverable">
          <thead>
            <tr>
              <th>No.</th>
              <th>제품명</th>
              <th>수량</th>
              <th>판매가</th>
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in voucherDetails" :key="detail.voucId">
              <td>{{ index + 1 }}</td>
              <td>{{ detail.proName }}</td>
              <td>{{ detail.voucAmount }}</td>
              <td>{{ detail.voucSale }}</td>
              <td>{{ detail.voucSales }}</td>
            </tr>
          </tbody>
        </table>
        <div class="total-sales">
          총합계: {{ totalVoucSales }}
        </div>
      </div>
      <p v-else>해당 전표번호에 대한 정보가 없습니다.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        voucId: '', // 초기값 빈 문자열
        voucDate: '',
        empName: '',
        signerName: '',
        clientName: '',
        storageCar: '',
        voucherDetails: [], // 출고전표 상세 정보를 저장할 배열
      };
    },
    mounted() {
      this.fetchVoucherDetails();
    },
    computed: {
    // 전표의 총 매출액을 계산하는 컴퓨티드 프로퍼티
    totalVoucSales() {
      return this.voucherDetails.reduce((total, detail) => {
        return total + (detail.voucSales || 0);
      }, 0);
    }
  },
    methods: {
        formatText(text) {
    return text.replace(/\n/g, '<br>')
  },
      async fetchVoucherDetails() {
        try {
          const response = await axios.get(`/api/vouchers/${this.$route.params.voucherID}/details`);
          const data = response.data;
  
          // 헤더 정보 할당
          this.voucId = data[0].voucId;
          this.voucDate = data[0].voucDate;
          this.empName = data[0].empName;
          this.signerName = data[0].signerName;
          this.clientName = data[0].clientName;
          this.storageCar = data[0].storageCar;
  
          // 상세 정보 배열 할당
          this.voucherDetails = data;
        } catch (error) {
          console.error('Error fetching voucher details:', error);
        }
      },
    },
  };
  </script>
  
<style>


</style>