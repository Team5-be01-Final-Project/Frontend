<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">거래처별 제품 등록 및 수정</h3>
      <div>
        <VaSelect v-model="selectedField" placeholder="검색 조건" :options="filterOptions"
          @update:modelValue="handleSelectedFieldChange()" style="margin-right: 5px;" />
        <VaInput v-model="filter" placeholder="검색어 입력" class="w-full" style="margin-right: 5px;" />
        <VaButton @click="applyFilter">검색</VaButton>
        <refresh-button class="left-margin"/>
        <VaButton @click="openRegisterModal" class="register-button">
          판매제품 등록
        </VaButton>
      </div>
      <div class="right-align">단위 : 원</div>
      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th>NO.</th>
            <th>거래처명</th>
            <th>제품명</th>
            <th>단가</th>
            <th>판매가</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ppc, index) in paginatedPpcs" :key="index">
            <td class='index-center'>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ ppc.clientName }}</td>
            <td>{{ ppc.proName }}</td>
            <td class='money-right'>{{ formatNumberWithCommas(ppc.proUnit) }}</td>
            <td class='money-right'>{{ formatNumberWithCommas(ppc.ppcSale) }}</td>
            <td class='index-center'>
              <VaButton preset="primary" class="mr-6 mb-2" @click="openEditModal(ppc)">
                <va-icon name="edit" />
              </VaButton>
            </td>
            <td class='index-center'>
              <VaButton preset="primary" color="danger" class="mr-6 mb-2" @click="openDeleteModal(ppc)"> <va-icon
                  name="delete" />
              </VaButton>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 페이지네이션 -->
      <div class="pagination">
        <VaButton @click="prevPage" :disabled="currentPage === 1">이전</VaButton>
        <VaButton disabled>{{ currentPage }}</VaButton>
        <VaButton @click="nextPage" :disabled="currentPage === pageCount">다음</VaButton>
      </div>
    </div>
    <EditDeleteModal :isVisible="isModalVisible" :currentItem="currentItem" :isEditing="isEditing" @close="closeModal"
      @edit="updatePpc" @delete="deletePpc" />
    <RegisterModal :isVisible="isRegisterModalVisible" @close="closeRegisterModal" @register="registerPpc" />
  </div>
</template>

<script>
import formatNumberWithCommas from '@/utils/formatNumberWithCommas.js';
import axios from 'axios';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';
import EditDeleteModal from '@/components/Modal.vue';
import RegisterModal from '@/components/RegisterModal.vue';
import RefreshButton from '@/components/RefreshButton.vue';

export default {
  components: {
    ProductSidebar,
    EditDeleteModal,
    RegisterModal,
    RefreshButton,
    
  },
  data() {
    return {
      ppcs: [],
      isModalVisible: false,
      currentItem: null,
      isEditing: false,
      isRegisterModalVisible: false,
      currentPage: 1,
      perPage: 20,
      selectedField: '전체', // 선택된 필터 옵션
      filter: '', // 사용자 입력 검색어
      actualFilter: '', // 실제 적용될 필터 값을 저장하는 새로운 데이터 속성
      // 필터 옵션
      filterOptions: [
        { text: '전체', value: '전체' },
        { text: '거래처명', value: 'clientName' },
      ],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.filteredPpcs.length / this.perPage);
    },
    filteredPpcs() {
      if (this.selectedField === '전체' || !this.actualFilter) {
        return this.ppcs;
      } else {
        return this.ppcs.filter(ppc =>
          ppc.clientName.toLowerCase().includes(this.actualFilter.toLowerCase())
        );
      }
    },
    paginatedPpcs() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredPpcs.slice(start, end);
    },
  },
  methods: {
    formatNumberWithCommas,
    fetchPpcs() {
      axios.get('/ppc/all').then((response) => {
        this.ppcs = response.data;
        this.filteredPpcs = [...this.ppcs]; // Initially display all data
      }).catch((error) => {
        console.error('Error fetching PPCs:', error);
      });
    },
    applyFilter() {
      // '전체' 옵션이 선택되었을 때와 검색 버튼을 클릭했을 때를 모두 처리
      if (this.selectedField !== '전체') {
        this.actualFilter = this.filter; // 입력된 검색어를 실제 필터 값에 할당
      } else {
        // '전체'를 선택했을 때는 `actualFilter`도 초기화합니다.
        this.actualFilter = '';
      }
      this.currentPage = 1; // 페이지를 첫 번째 페이지로 리셋
    },
    // Other methods (nextPage, prevPage, openEditModal, etc.) remain unchanged...
    nextPage() {
      // 다음 페이지로 이동
      if (this.currentPage < this.pageCount) this.currentPage++;
    },
    prevPage() {
      // 이전 페이지로 이동
      if (this.currentPage > 1) this.currentPage--;
    },
    openEditModal(ppc) {
      this.currentItem = { ...ppc };
      this.isEditing = true;
      this.isModalVisible = true;
    },
    openDeleteModal(ppc) {
      this.currentItem = { ...ppc };
      this.isEditing = false;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.currentItem = null;
    },
    updatePpc(updatedPpc) {
      axios
        .put(`/ppc/${updatedPpc.clientCode}/${updatedPpc.proCode}`, updatedPpc)
        .then(() => {
          this.fetchPpcs();
          this.closeModal();
        })
        .catch((error) => {
          console.error('상품 가격 정보를 업데이트하는데 실패했습니다:', error);
        });
    },
    deletePpc(deletedPpc) {
      axios.delete(`/ppc/${deletedPpc.clientCode}/${deletedPpc.proCode}`)
        .then(() => {
          this.fetchPpcs();
          this.closeModal();
        })
        .catch((error) => {
          console.error('상품 가격 정보를 삭제하는데 실패했습니다:', error);
        });
    },
    openRegisterModal() {
      this.isRegisterModalVisible = true;
    },
    closeRegisterModal() {
      this.isRegisterModalVisible = false;
    },
    registerPpc(newPpc) {
      axios
        .post('/ppc/register', newPpc)
        .then(() => {
          this.fetchPpcs();
          this.closeRegisterModal();
        })
        .catch((error) => {
          console.error('상품 가격 정보를 등록하는데 실패했습니다:', error);
          alert('상품 가격 정보를 등록하는데 실패했습니다.');
        });
    },
    handleSelectedFieldChange() {
      this.filter = '';
      this.actualFilter = '';

    },

  },
  mounted() {
    this.fetchPpcs();
  },
};
</script>

<style scoped>
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

.register-button {
  float: right;
  /* 버튼을 오른쪽으로 이동시킵니다. */
}

.pagination {
  display: flex;
  justify-content: center;
  /* 페이지네이션 버튼을 중앙에 위치시키기 */
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

.va-table thead th {
  background-color: #DEE5F2; /* 짙은 파란색 배경 */
  font-weight: bold; /* 글자 굵게 */
  border: 2px solid #cccccc;
  border-bottom: 2px solid #cccccc; /* 회색 테두리 */
  font-size: 15px;
}

.left-margin{
  margin-left: 5px;
}
</style>
