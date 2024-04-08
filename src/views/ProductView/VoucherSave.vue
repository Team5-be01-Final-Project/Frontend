<!-- VoucherDetail.vue -->
<template>

  <div class="flex">
      <!-- 사이드바 섹션 -->
      <div class="sidebar">
          <ProductSidebar/>
      </div>
      <div>
          <div class="header">
              <h3 class="va-h3">출고전표 등록</h3>
              <div class="button-container">
                  <button @click="SaveVoucher" class="approve-button">등록</button>
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
                    <span class="voucher-info-label">거래처:</span>
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
                      <span class="voucher-info-label">차량번호:</span>
                      <span class="voucher-info-value">{{ storageCar }}</span>
                  </div>
                  <div class="voucher-info-item">
                    <span class="voucher-info-label">결재자:</span>
                    <span class="voucher-info-value">{{ signerName }}</span>
                  </div>
              </div>
          </div>
          <div class="voucher-info">
              <div class="voucher-info-row">
                  <va-select v-model="selectedClient" placeholder="거래처 선택" :options="clientOptions" @update:modelValue="fetchProducts()" />
              </div>
              <div class="voucher-info-row">
                  <va-select v-model="selectedProduct" placeholder="상품 선택" :options="productOptions" @update:modelValue="fetchProductStock()" />
                  <div v-if="selectedProduct">
                      <span class="voucher-info-label">재고량: </span>
                      <span class="voucher-info-value">{{ selectedProductStock }}</span>
                  </div>
                  <va-input type="number" v-model.number="selectedQuantity" placeholder="수량" />
                  <button @click="addProduct" class="approve-button">추가</button>
              </div>
          </div>
          <hr />
          <div class="spacer" style="height: 20px"></div>
          <table class="va-table va-table--hoverable">
              <thead>
                <tr>
                  <th>No</th>
                  <th>상품코드</th>
                  <th>상품명</th>
                  <th>판매가</th>
                  <th>수량</th>
                  <th>금액</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in addproductlist" :key="index">
                  <td>{{ index+1 }}</td>
                  <td>{{ product.proCode }}</td>
                  <td>{{ product.proName }}</td>
                  <td>{{ product.voucSale }}</td>
                  <td>{{ product.voucAmount }}</td>
                  <td>{{ product.voucSales }}</td>
                  <td>
                    <VaButton @click="removeProduct(index)" class="delete-button">삭제</VaButton>
                  </td>
                </tr>
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
  import axios from "axios";
    import VoucherApproval from "@/components/VoucherApproval.vue";
    import ProductSidebar from '@/components/sidebar/ProductSidebar.vue'
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
            clientOptions: [],
            productOptions: [],
            selectedClient: "",
            selectedProduct: null,
            selectedProductDetails: null,
            selectedProductStock: -1,
            addproductlist: []
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
        
      },
      methods: {
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
        const empCode = 2016101542;
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
          axios.get(`/api/products/${this.selectedClient.value}/ppcs`)
            .then(response => {
              this.products = response.data.map(product => ({
                ...product,
                text: product.proName, // 상품 이름
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
        addProduct() { //전표에 판매 상품 추가
          console.log(this.selectedProduct)
          console.log(this.products);
          console.log(this.selectedQuantity);
          const productInfo = this.products.find(product => product.value === this.selectedProduct.value);
          if (productInfo && this.selectedQuantity > 0) {
            const newProduct = {
              proCode: productInfo.proCode,
              proName: productInfo.proName,
              voucSale: productInfo.ppcSale,//판매가
              voucAmount: this.selectedQuantity,//수량
              voucSales: productInfo.ppcSale * this.selectedQuantity,
            };
            this.addproductlist.push(newProduct);
            // 입력 필드 초기화
            this.selectedQuantity = 0;
          } else {
            alert("상품을 선택하고, 유효한 수량을 입력하세요.");
          }
        },
        removeProduct(index) {
          // 지정된 인덱스의 상품을 리스트에서 제거
          this.addproductlist.splice(index, 1);
        },
        fetchVoucherId(){//전표 번호 가져오기
          axios.get('/api/vouchers/voucId')
          .then(response => {
            this.voucId = response.data.voucId; // 백엔드로부터 받은 전표번호를 저장
          })
          .catch(error => {
            console.error('전표번호 생성 중 오류:', error);
          });
        },
        SaveVoucher() {
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
            axios.post('/api/vouchers/saveall', voucherData)
              .then(response => {
                alert("전표가 성공적으로 저장되었습니다.");
                // 성공 후 필요한 동작(예: 페이지 새로고침, 다른 페이지로 이동 등)
              })
              .catch(error => {
                if (error.response && error.response.status === 409) {
                  // 재고 부족 에러 처리
                  alert("재고가 부족합니다: " + error.response.data);
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
    
    .approve-button,
    .reject-button {
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
    
    .reject-button {
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