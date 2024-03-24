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
            <td>{{ client.clientCode }}</td>
            <td>{{ client.clientName }}</td>
            <td>{{ clientClassText(client.clientClass) }}</td>
            <td>{{ client.clientWhere }}</td>
            <td>{{ client.clientPost }}</td>
            <td>{{ client.clientBoss }}</td>
            <td>{{ client.clientEmp }}</td>
            <td>{{ client.clientEmpTel }}</td>
            <td>
             <!-- 삭제 버튼 추가 -->
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

<script>
import axios from 'axios';
import { VaSelect, VaInput, VaButton } from 'vuestic-ui';

export default {
  components: {
    VaSelect,
    VaInput,
    VaButton,
  },
  data() {
    return {
      clients: [],
      selectedField: null,
      filter: '',
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filterOptions() {
      return [
        { text: '거래처명', value: 'clientName' },
        { text: '병원 분류', value: 'clientClass' },
        { text: '대표명', value: 'clientBoss' },
        { text: '담당자', value: 'clientEmp' }
      ];
    },
    filteredClients() {
      if (!this.filter || !this.selectedField) {
        return this.clients;
      }
      return this.clients.filter(client =>
        String(client[this.selectedField]).toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredClients.slice(start, start + this.perPage);
    },
    pageCount() {
      return Math.ceil(this.filteredClients.length / this.perPage);
    },
  },
  methods: {
    clientClassText(clientClass) {
      const classes = { 1: '1등급', 2: '2등급', 3: '3등급' };
      return classes[clientClass] || '미분류';
    },
    fetchClients() {
      axios.get('/clients/list')
        .then(response => {
          this.clients = response.data;
        })
        .catch(error => {
          console.error('거래처 목록을 가져오는 데 실패했습니다:', error);
        });
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {        this.currentPage--;
      }
    },
  },
  deleteClient(clientCode) {
      if (confirm(`정말로 거래처를 삭제하시겠습니까? [${clientCode}]`)) {
        axios.delete(`/clients/${clientCode}`)
          .then(() => {
            alert('거래처가 성공적으로 삭제되었습니다.');
            this.fetchClients(); // 거래처 목록을 다시 불러옵니다.
          })
          .catch(error => {
            console.error('거래처 삭제 중 오류가 발생했습니다:', error);
            alert('거래처 삭제 중 오류가 발생했습니다.');
          });
      }
    },
  created() {
    this.fetchClients(); // 컴포넌트가 생성될 때 거래처 목록을 가져옴
  }

};


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
</style>

       
