<!-- VoucherDetail.vue -->
<template>
  <div class="flex">
      <!-- 사이드바 섹션 -->
      <div class="sidebar">
          <ProductSidebar/>
      </div>
      <div>
          <div class="header">
              <h3 class="va-h3">전표 등록</h3>
              <div class="button-container">
                  <VaButton  @click="SaveVoucher">등록</VaButton >
              </div>
          </div>
          <div class="spacer" style="height: 20px"></div>
          <div class="voucher-info">
              <div class="voucher-info-row">
                  <div class="voucher-info-item">
                      <span class="voucher-info-label">전표번호:</span>
                      <span class="voucher-info-value">{{ voucId  }}</span>
                  </div>
                  <div class="voucher-info-item">
                      <span class="voucher-info-label">등록일:</span>
                      <span class="voucher-info-value">{{ dateString }}</span>
                  </div>
                  <div class="voucher-info-item">
                    <span class="voucher-info-label">거래처명:</span>
                    <span class="voucher-info-value">{{ selectedClient.text }}</span>
                  </div>
              </div>
          </div>
          <div class="voucher-info">
              <div class="voucher-info-row">
                  <div class="voucher-info-item">
                      <span class="voucher-info-label">담당자:</span>
                      <span class="voucher-info-value">{{ empName }}</span>
                  </div>
                  <div class="voucher-info-item">
                    <span class="voucher-info-label">결재자:</span>
                    <span class="voucher-info-value">{{ signerName }}</span>
                  </div>
              </div>
          </div>
          <div class="voucher-info">
              <div class="voucher-info-row">
                  <va-select v-model="selectedClient" 
                  placeholder="거래처 선택" 
                  :options="clientOptions" 
                  :disabled="addproductlist.length > 0"
                  @update:modelValue="fetchProducts()" />
              </div>
              <div class="voucher-info-row">
                  <va-select v-model="selectedProduct" placeholder="제품 선택" :options="productOptions" @update:modelValue="fetchProductStock()" />
                  <div v-if="selectedProduct">
                      <span class="voucher-info-label">재고량: </span>
                      <span class="voucher-info-value">{{ formatNumberWithCommas(selectedProductStock) }}</span>
                  </div>
                  <va-input type="number" v-model.number="selectedQuantity" placeholder="수량" />
                  <VaButton  @click="addProduct">추가</VaButton >
              </div>
          </div>
          <hr />
          <div class="spacer" style="height: 20px"></div>
          <table class="va-table va-table--hoverable">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>품목코드</th>
                  <th>제품명</th>
                  <th>판매가</th>
                  <th>수량</th>
                  <th>매출액</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in addproductlist" :key="index">
                  <td class = 'index-center'>{{ index+1 }}</td>
                  <td>{{ product.proCode }}</td>
                  <td>{{ product.proName }}</td>
                  <td class = 'money-right'>{{ formatNumberWithCommas(product.voucSale) }}</td>
                  <td class = 'money-right'>{{ formatNumberWithCommas(product.voucAmount) }}</td>
                  <td class = 'money-right'>{{ formatNumberWithCommas(product.voucSales) }}</td>
                   <td class='index-center'>
                    <VaButton preset="primary" color="danger" class="mr-6 mb-2" @click="removeProduct(index)"> <va-icon
                  name="delete" />
              </VaButton>
                    <!-- <VaButton @click="removeProduct(index)" color="danger" class="mr-6 mb-2">삭제</VaButton> -->
                  </td>
                </tr>
              </tbody>
          </table>
          <div class="total-sales">총 합계(매출액): {{ formatNumberWithCommas(totalSales) }}원</div>
      </div>
  </div>
</template>

<script>
  import axios from "axios";
    import VoucherApproval from "@/components/VoucherApproval.vue";
    import ProductSidebar from '@/components/sidebar/ProductSidebar.vue'
    import formatNumberWithCommas from '@/utils/formatNumberWithCommas.js';
    import Cookies from 'js-cookie'

    export default {
      components: { VoucherApproval, ProductSidebar },
      data() {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const dateString = `${year}-${month}-${day}`;

        return {
            empName: "",
            empCode: "",
            signerName: "",
            signerCode: "",
            dateString,
            voucId: "",
            clients: [],
            products: [],
            clientOptions: [], //거래처 선택 리스트
            productOptions: [], //선택한 거래처의 상품 리스트
            selectedClient: "",
            selectedProduct: null, //선택한 상품
            selectedProductStock: -1, //선택한 상품의 재고
            addproductlist: [] //등록 상품 리스트트
        };
      },

      created() {
      },
      mounted() {
        this.initialize().then(() => {
          this.fetchClients();
          this.fetchApprover();
          this.fetchVoucherId();
        });
      },
      computed: {
        totalSales(){
          return this.addproductlist.reduce((total, product) => total + product.voucSales, 0);
        }
      },
      methods: {
        formatNumberWithCommas,
        fetchApprover() {// 담당자의 부서의 팀장(결재자) 가져오기
          axios.get(`/employees/${this.empCode}/approver`)
          // console.log(response)
            .then(response => {
              this.signerName = response.data.signerName;
              this.signerCode = response.data.signerCode;
            })
            .catch(error => {
              console.error("Error fetching approver:", error);
              this.signerName = '결재자 정보를 불러오는데 실패했습니다.';
            });
        },
        async initialize(){
          const empName = Cookies.get('empName');
          const empCode = Cookies.get('empCode');

          this.empName = empName;
          this.empCode = empCode;
        },
        fetchClients() { // 담당자의 거래처 리스트 가져오기
        // 예시 empCode
        const empCode = this.empCode;
        axios.get(`/employees/${empCode}/clients`)
            .then(response => {
            this.clients = response.data;
            this.clientOptions = this.clients.map(client => ({
                text: client.clientName,
                value: client.clientCode
            }));
            })
            .catch(error => console.error("Error fetching clients:", error));
        },
        fetchProducts() { //선택한 거래처의 상품리스트 가져오기
          if (!this.selectedClient) return;
          console.log(this.selectedClient)
          axios.get(`/products/${this.selectedClient.value}/ppcs`)
            .then(response => {
              this.products = response.data.map(product => ({
                ...product,
                text: `[${product.proCode}, ${product.proName}]`, // 상품 이름
                value: product.proCode, // 상품 코드
              }));
              // 상품 옵션 업데이트
              this.productOptions = this.products.map(product => ({
                text: product.text, // 상품 이름
                value: product.value, // 상품 코드
              }));
              // this.selectedProduct = null; // 상품 선택 초기화
            })
            .catch(error => console.error("Error fetching products:", error));
        },
        fetchProductStock() { //선택한 상품의 재고량 가져오기
          // console.log(this.selectedProduct)
          // console.log(this.products);
          const productInfo = this.products.find(product => product.value === this.selectedProduct.value);
          if (productInfo && productInfo.ppcStock !== undefined) {
            this.selectedProductStock = productInfo.ppcStock; // 재고량 업데이트
          } else {
            console.log("Product info is undefined or ppcStock is not available.");
          }
        },
        addProduct() { //리스트에 판매 상품 추가
          console.log(this.selectedProduct)
          console.log(this.products);
          console.log(this.selectedQuantity);
          const productInfo = this.products.find(product => product.value === this.selectedProduct.value);
          const existingProduct = this.addproductlist.find(p => p.proCode === productInfo.proCode);

          if(existingProduct){
            // 이미 목록에 존재하는 상품인 경우 경고 메시지 표시
            alert("이미 목록에 같은 상품이 있습니다.");
          }
          else if (productInfo && this.selectedQuantity > 0 && this.selectedQuantity<=this.selectedProductStock) {
            const newProduct = {
              proCode: productInfo.proCode,
              proName: productInfo.proName,
              voucSale: productInfo.ppcSale,//판매가
              voucAmount: this.selectedQuantity,//수량
              voucSales: productInfo.ppcSale * this.selectedQuantity,
            };
            this.addproductlist.push(newProduct);

            this.selectedQuantity = 0;// 입력 필드 초기화
            this.selectedProduct = null; // 선택된 상품 초기화
          } else {
            alert("상품을 선택하고, 유효한 수량을 입력하세요.");
          }
        },
        removeProduct(index) { //리스트에서 판매 상품 삭제
          this.addproductlist.splice(index, 1);
        },
        fetchVoucherId(){//전표 번호 가져오기
          axios.get('/vouchers/voucId')
          .then(response => {
            this.voucId = response.data.voucId; // 백엔드로부터 받은 전표번호를 저장
          })
          .catch(error => {
            console.error('전표번호 생성 중 오류:', error);
          });
        },
        SaveVoucher() { //전표 등록
          // 전송할 전체 데이터 구성
          if(this.clientCode!==""){
            const voucherData = {
              voucId: this.voucId,
              voucDate: this.dateString,
              empCode: this.empCode,
              signerCode: this.signerCode,
              clientCode: this.selectedClient.value,
              approvalCode: "A00",
              items: this.addproductlist.map(item => ({
                proCode: item.proCode,
                voucSale: item.voucSale,
                voucAmount: item.voucAmount,
                voucSales: item.voucSales,
              }))
            };
            console.log(voucherData)
            axios.post('/vouchers/saveall', voucherData)
              .then(response => {
                alert("전표가 성공적으로 저장되었습니다.");
                this.$router.push({ name: 'viewvoucher' }); // 저장 성공 후 전표 목록 페이지로 이동
              })
              .catch(error => {
                if (error.response && error.response.status === 409) {
                  // 재고 부족 에러 처리
                  alert("전표 저장에 실패했습니다: " + error.response.data);
                  this.fetchProducts();
                } else {
                  // 기타 에러 처리
                  alert("전표 저장에 실패했습니다: " + error.message);
                }
              });
            }
        },
      }
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
    
    /* 테이블 헤더 배경색 */
    .va-table th {
      background-color: #DEE5F2;
      font-weight: bold;
    }
    
    .va-table tr:hover {
      background-color: #f5f5f5;
    }

    .va-table thead th {
  background-color: #DEE5F2; /* 짙은 파란색 배경 */
  font-weight: bold; /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc; /* 회색 테두리 */
  font-size: 15px;
}
</style>