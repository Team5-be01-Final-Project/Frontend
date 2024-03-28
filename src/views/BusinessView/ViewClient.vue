<template>
  <div class="client-list">
    <div class="va-table-responsive">
      <h3 class="va-h3">거래처 목록</h3>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <VaSelect
          v-model="selectedField"
          placeholder="필터링할 필드 선택"
          :options="filterOptions"
          value-by="value"
        />
        <VaInput
          v-model="filter"
          placeholder="검색..."
          class="w-full"
        />
      </div>
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>사업자등록번호</th>
            <th>거래처명</th>
            <th>병원 분류</th>
            <th>주소</th>
            <th>우편번호</th>
            <th>대표명</th>
            <th>담당자</th>
            <th>담당자 연락처</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in paginatedClients" :key="client.clientCode">
            <td @click="navigateToDetail(client.clientCode)" class="clickable">{{ client.clientCode }}</td>
            <td>{{ client.clientName }}</td>
            <td>{{ clientClassText(client.clientClass) }}</td>
            <td>{{ client.clientWhere }}</td>
            <td>{{ client.clientPost }}</td>
            <td>{{ client.clientBoss }}</td>
            <td>{{ client.clientEmp }}</td>
            <td>{{ client.clientEmpTel }}</td>
            <td>
              <VaButton color="danger" @click="deleteClient(client.clientCode)">삭제</VaButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
        <VaButton disabled>{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import { VaSelect, VaInput, VaButton } from 'vuestic-ui';
const router = useRouter();
const clients = ref([]);
const selectedField = ref(null);
const filter = ref('');
const currentPage = ref(1);
const perPage = ref(10);

const filterOptions = ref([
  { text: '거래처명', value: 'clientName' },
  { text: '병원 분류', value: 'clientClass' },
  { text: '대표명', value: 'clientBoss' },
  { text: '담당자', value: 'clientEmp' }
]);

const filteredClients = computed(() => {
  if (!filter.value || !selectedField.value) {
    return clients.value;
  }
  return clients.value.filter(client =>
    String(client[selectedField.value]).toLowerCase().includes(filter.value.toLowerCase())
  );
});

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredClients.value.slice(start, start + perPage.value);
});

const pageCount = computed(() => {
  return Math.ceil(filteredClients.value.length / perPage.value);
});

function clientClassText(clientClass) {
  const classes = { 1: '1등급', 2: '2등급', 3: '3등급' };
  return classes[clientClass] || '미분류';
}

function fetchClients() {
  axios.get('/clients/list')
    .then(response => {
      clients.value = response.data;
    })
    .catch(error => {
      console.error('거래처 목록을 가져오는 데 실패했습니다:', error);
    });
}

function navigateToDetail(clientCode) {
  // 프로그래매틱 네비게이션으로 상세 페이지로 이동
  router.push(`/clientdetail/${clientCode}`);
}

function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
}

function prevPage() {
if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function deleteClient(clientCode) {
  if (confirm(`정말로 거래처를 삭제하시겠습니까? [${clientCode}]`)) {
    axios.delete(`/clients/${clientCode}`)
      .then(() => {
        alert('거래처가 성공적으로 삭제되었습니다.');
        fetchClients(); // 거래처 목록을 다시 불러옵니다.
      })
      .catch(error => {
        console.error('거래처 삭제 중 오류가 발생했습니다:', error);
        alert('거래처 삭제 중 오류가 발생했습니다.');
      });
  }
}

onMounted(() => {
  fetchClients();
});
</script>
<style>
.va-table-responsive {
  overflow: auto;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.pagination button {
  margin: 0 5px;
}

.clickable {
  cursor: pointer;
}
</style>