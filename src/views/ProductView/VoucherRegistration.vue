<template>
    <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div>
    <h1>매출 전표 등록</h1>
    <div>
      <label for="employee">담당자:</label>
      <select id="employee" v-model="selectedEmployee.value">
        <option v-for="employee in employees" :key="employee.empCode" :value="employee">
          {{ employee.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="client">거래처:</label>
      <select id="client" v-model="selectedClient.value">
        <option v-for="client in clients" :key="client.code" :value="client">
          {{ client.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="product">상품:</label>
      <select id="product" v-model="selectedProduct.value">
        <option v-for="product in products" :key="product.id" :value="product">
          {{ product.name }}
        </option>
      </select>
      <input type="number" v-model="quantity.value" placeholder="수량" />
      <button @click="addItem">추가</button>
    </div>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item.product.name }} - 수량: {{ item.quantity }} - 판매가: {{ item.salePrice }} - 총액: {{ item.totalPrice }}
      </li>
    </ul>
    <div>총 매출액: {{ totalSales.value }}</div>
    <button @click="registerVoucher">등록</button>
  </div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';

export default {
  setup() {
    const employees = ref([]);
    const clients = ref([]);
    const products = ref([]);
    const stocks = ref([]);
    const selectedEmployee = ref(null);
    const selectedClient = ref(null);
    const selectedProduct = ref(null);
    const quantity = ref(0);
    const items = ref([]);
    const totalSales = ref(0);

    onMounted(() => {
      fetchData();
    });

    const fetchData = async () => {
      employees.value = (await axios.get('/VoucherRegistration/employees')).data;
      clients.value = (await axios.get('/VoucherRegistration/clients')).data;
      products.value = (await axios.get('/VoucherRegistration/products')).data;
      stocks.value = (await axios.get('/VoucherRegistration/stocks')).data;
    };

    const addItem = () => {
      const stock = stocks.value.find((s) => s.product.id === selectedProduct.value.id);
      if (stock.stoAmo < quantity.value) {
        alert('재고 부족');
        return;
      }

      const item = {
        product: selectedProduct.value,
        quantity: quantity.value,
        salePrice: selectedClient.value.salePrice, // 거래처별 판매가격
        totalPrice: quantity.value * selectedClient.value.salePrice,
      };
      items.value.push(item);
      totalSales.value += item.totalPrice;
      quantity.value = 0;
      selectedProduct.value = null;
    };

    const registerVoucher = async () => {
      const voucherRegistrationDTO = {
        empCode: selectedEmployee.value.empCode,
        clientCode: selectedClient.value.code,
        items: items.value.map((item) => ({
          productId: item.product.id,
          voucAmount: item.quantity,
          voucSale: item.salePrice,
          voucherSales: item.totalPrice,
        })),
      };
      try {
        const response = await axios.post('/VoucherRegistration', voucherRegistrationDTO, {
          headers: { empCode: selectedEmployee.value.empCode },
        });
        console.log('전표 등록 완료:', response.data);
        // 전표 등록 후 처리할 작업 추가
      } catch (error) {
        console.error('전표 등록 실패:', error);
      }
    };

    return {
      employees,
      clients,
      products,
      stocks,
      selectedEmployee,
      selectedClient,
      selectedProduct,
      quantity,
      items,
      totalSales,
      addItem,
      registerVoucher,
    };
  },
};
</script>