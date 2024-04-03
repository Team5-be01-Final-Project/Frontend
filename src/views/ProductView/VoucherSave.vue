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
                  <button @click="SVGAElementVoucher" class="approve-button">등록</button>
              </div>
          </div>
          <div class="spacer" style="height: 20px"></div>
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
              </div>
          </div>
          <div class="voucher-info">
              <div class="voucher-info-row">
                  <va-select v-model="selectedClient" placeholder="거래처 선택" :options="clientOptions" @update:modelValue="fetchProducts()" />
              </div>
              <div class="voucher-info-row">
                  <va-select v-model="selectedProduct" placeholder="상품 선택" :options="productOptions" @update:modelValue="fetchProductStock()" />
                  <div v-if="selectedProduct">
                      <span class="voucher-info-label">재고량:</span>
                      <span class="voucher-info-value">{{ selectedProductStock }}</span>
                      <input type="number" v-model.number="selectedQuantity" placeholder="수량" />
                      <button @click="addProduct">추가</button>
                  </div>
              </div>
          </div>
          <hr />
          <div class="spacer" style="height: 20px"></div>
          <table class="va-table va-table--hoverable">
              <thead>
                  <tr>
                      <th>상품코드</th>
                      <th>상품명</th>
                      <th>판매가</th>
                      <th>수량</th>
                      <th>금액</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(product, index) in addproductlist" :key="index">
                      <td>{{ product.proCode }}</td>
                      <td>{{ product.proName }}</td>
                      <td>{{ product.voucSale }}</td>
                      <td>{{ product.voucAmount }}</td>
                      <td>{{ product.voucSales }}</td>
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
    
    export default {
      components: { VoucherApproval, ProductSidebar },
      data() {
        const empCode = 2016101542
        const storageCar = ""
        return {
            empName: "서현진",
            clients: [],
            products: [],
            clientOptions: [],
            productOptions: [],
            selectedClient: null,
            selectedProduct: null,
            selectedProductDetails: null,
            selectedProductStock: -1,
            addproductlist: []
        };
      },
      created() {
        this.fetchClients();
      },
      mounted() {
        
      },
      computed: {
        
      },
      methods: {
        fetchClients() {
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
        fetchProducts() {
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
        fetchProductStock() {
          // console.log(this.selectedProduct)
          // console.log(this.products);
          const productInfo = this.products.find(product => product.value === this.selectedProduct.value);
          if (productInfo && productInfo.ppcStock !== undefined) {
            this.selectedProductStock = productInfo.ppcStock; // 재고량 업데이트
          } else {
            console.log("Product info is undefined or ppcStock is not available.");
          }
        },
        addProduct() {
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