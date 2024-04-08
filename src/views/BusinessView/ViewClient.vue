<!-- ViewClient.vue -->
<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <BusinessSidebar />
    </div>

    <div class="Main">
      <div class="va-table-responsive">
        <h3 class="va-h3">거래처 조회</h3>
        <div class="grid md:grid-cols-3 gap-6 mb-6 items-center">
          <VaSelect
            v-model="selectedField"
            placeholder="검색 조건"
            :options="searchOptions"
            value-by="value"
          />
          <VaInput
            v-model="searchKeyword"
            placeholder="검색어 입력"
            class="w-full search-input"
          />
          <VaButton @click="searchClients" class="search-button">검색</VaButton>
        </div>
        <table class="va-table va-table--hoverable full-width">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { VaSelect, VaInput, VaButton } from 'vuestic-ui';
import BusinessSidebar from '@/components/sidebar/BusinessSidebar.vue';

const router = useRouter();
const clients = ref([]); // 전체 거래처 목록
const searchResults = ref([]); // 검색 결과 목록
const selectedField = ref(null); // 검색할 필드
const searchKeyword = ref(''); // 검색어
const currentPage = ref(1); // 현재 페이지
const perPage = ref(10); // 페이지당 보여줄 거래처 수

const searchOptions = ref([
  { text: '거래처명', value: 'clientName' },
  { text: '병원 분류', value: 'clientClass' },
  { text: '대표명', value: 'clientBoss' },
  { text: '담당자', value: 'clientEmp' }
]);

// 페이지네이션 된 거래처 목록 계산
const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return searchResults.value.slice(start, start + perPage.value);
});

// 전체 페이지 수 계산
const pageCount = computed(() => {
  return Math.ceil(searchResults.value.length / perPage.value);
});

// 병원 분류 텍스트 변환
function clientClassText(clientClass) {
  const classes = { 1: '1차 병원', 2: '2차 병원', 3: '3차 병원' };
  return classes[clientClass] || '미분류';
}

// 거래처 목록 가져오기
function fetchClients() {
  axios.get('/clients/list')
    .then(response => {
      clients.value = response.data;
      searchResults.value = response.data; // 초기 검색 결과는 전체 거래처 목록
    })
    .catch(error => {
      console.error('거래처 목록을 가져오는 데 실패했습니다:', error);
    });
}

// 거래처 상세 페이지로 이동
function navigateToDetail(clientCode) {
  router.push(`/business/clientdetail/${clientCode}`);
}

// 다음 페이지로 이동
function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
}

// 이전 페이지로 이동
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// 거래처 삭제
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

// 거래처 검색
function searchClients() {
  if (selectedField.value && searchKeyword.value) {
    searchResults.value = clients.value.filter(client =>
      String(client[selectedField.value]).toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  } else {
    searchResults.value = clients.value;
  }
  currentPage.value = 1; // 검색 후 현재 페이지를 1로 초기화
}

onMounted(() => {
  fetchClients();
});
</script>

<style>
.search-input {
    margin-right: 16px; /* 오른쪽 마진 추가 */
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

.flex {
    display: flex;
}

.sidebar {
    width: 250px;
    /* 사이드바의 너비를 조절하세요 */
    /* 필요에 따라 추가 스타일링 */
}
.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}

</style>