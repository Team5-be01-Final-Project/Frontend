<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>
    <div class="sales-voucher-registration">
      <va-card>
        <va-card-title>매출 전표 등록</va-card-title>
        <va-card-text>
          <va-input
            label="담당자"
            :value="employeeName"
            readonly
          />
          <va-select
            label="거래처"
            v-model="selectedClientCode"
            :options="clientOptions"
            @input="fetchClientDetails"
          />
          <va-input
            label="차량 번호"
            :value="selectedVehicle"
            readonly
          />
          <va-select
            label="결재자"
            v-model="selectedSignerCode"
            :options="signerOptions"
          />
          <va-button @click="openProductModal">상품 검색</va-button>
          <va-input
            label="수량"
            v-model.number="quantity"
            type="number"
          />
          <va-button
            color="primary"
            @click="addItem"
          >
            추가
          </va-button>
        </va-card-text>
        <va-card-actions>
          <va-button
            color="success"
            @click="registerVoucher"
          >
            전표 등록
          </va-button>
        </va-card-actions>
      </va-card>
      <va-modal v-model="isProductModalOpen">
        <template #header>
          <h3>상품 검색</h3>
        </template>
        <va-input v-model="searchQuery" />
        <va-list>
          <va-list-item
            v-for="product in filteredProducts"
            :key="product.id"
            @click="selectProduct(product)"
          >
            {{ product.name }} - 재고: {{ product.stock }}
          </va-list-item>
        </va-list>
        <template #footer>
          <va-button @click="isProductModalOpen = false">닫기</va-button>
        </template>
      </va-modal>
      <va-table bordered>
        <va-table-header>
          <va-table-header-cell>No</va-table-header-cell>
          <va-table-header-cell>상품명</va-table-header-cell>
          <va-table-header-cell>수량</va-table-header-cell>
          <va-table-header-cell>판매가</va-table-header-cell>
          <va-table-header-cell>총액</va-table-header-cell>
        </va-table-header>
        <va-table-body>
          <va-table-row
            v-for="(item, index) in addedProducts"
            :key="index"
          >
            <va-table-cell>{{ index + 1 }}</va-table-cell>
            <va-table-cell>{{ item.productName }}</va-table-cell>
            <va-table-cell>{{ item.quantity }}</va-table-cell>
            <va-table-cell>{{ item.salePrice }}</va-table-cell>
            <va-table-cell>{{ item.totalPrice }}</va-table-cell>
          </va-table-row>
        </va-table-body>
      </va-table>
      <div class="total-sales">
        <strong>총 매출액:</strong> {{ totalSales }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';

// 상태 참조
const employees = ref([]);
const selectedEmployee = ref(null);
const selectedVehicle = ref('');
const selectedSignerCode = ref(null);
const employeeName = ref('');
const totalSales = ref(0);

// 필요한 데이터 가져오기
const fetchData = async () => {
  const empCodeValue = getCookieValue('emp_code');
  if (empCodeValue) {
    const employeeResponse = await axios.get(`/VoucherRegistration/employees/${empCodeValue}`);
    const employee = employeeResponse.data;
    selectedEmployee.value = employee;
    employeeName.value = employee.empName;
    selectedVehicle.value = employee.storageCar; // 예를 들어 직원에게 연결된 차량 번호가 있다고 가정합니다.
  }

  const signersResponse = await axios.get('/VoucherRegistration/signers');
  const signers = signersResponse.data;
  selectedSignerCode.value = signers.length ? signers[0].empCode : null; // 첫번째 결재자를 기본으로 선택
};

onMounted(fetchData);

// 상품 추가하기
const addItem = () => {
  if (searchQuery.value && quantity.value) {
    const product = products.value.find(p => p.name === searchQuery.value);
    const stock = stocks.value.find(s => s.productId === product.id);
    if (stock.quantity < quantity.value) {
      alert('재고가 부족합니다.');
      return;
    }

    addedProducts.value.push({
      productName: product.name,
      quantity: quantity.value,
      salePrice: product.salePrice,
      totalPrice: quantity.value * product.salePrice,
    });
    searchQuery.value = '';
    quantity.value = 1;
  }
};

// 상품 모달 열기
const openProductModal = () => {
  isProductModalOpen.value = true;
};

// 상품 선택하기
const selectProduct = (product) => {
  searchQuery.value = product.name;
  isProductModalOpen.value = false;
};

// 거래처, 차량 옵션 생성
const clientOptions = computed(() => clients.value.map(c => ({ label: c.clientName, value: c.clientCode })));
const signerOptions = computed(() => signers.value.map(s => ({ label: s.signerName, value: s.signerCode })));

// 상품 검색 결과 필터
const filteredProducts = computed(() => products.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase())));

// 전표 등록하기
const registerVoucher = async () => {
  // 전표 등록 로직
};
// 쿠키에서 값을 가져오는 함수
function getCookieValue(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
onMounted(fetchData);
</script>
