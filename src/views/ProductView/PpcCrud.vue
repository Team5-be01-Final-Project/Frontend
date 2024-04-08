<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>

    <div class="Main">
      <h3 class="va-h3">거래처별 상품 등록 및 수정</h3>
      <div class="register-button-container">
        <VaButton @click="openRegisterModal" class="register-button">
          판매상품 등록
        </VaButton>
      </div>
      <table class="va-table va-table--hoverable full-width">
        <thead>
          <tr>
            <th>거래처명</th>
            <th>상품명</th>
            <th>판매가</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ppc, index) in ppcs" :key="index">
            <td>{{ ppc.clientName }}</td>
            <td>{{ ppc.proName }}</td>
            <td>{{ ppc.ppcSale }}</td>
            <td>
              <VaButton color="warning" class="mr-6 mb-2" @click="openEditModal(ppc)">
               <va-icon name="edit"/></VaButton>
            </td>
            <td>
              <VaButton color="danger" class="mr-6 mb-2" @click="openDeleteModal(ppc)"> <va-icon name="delete"/></VaButton>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
    <EditDeleteModal :isVisible="isModalVisible" :currentItem="currentItem" :isEditing="isEditing" @close="closeModal"
      @edit="updatePpc" @delete="deletePpc" />
    <RegisterModal :isVisible="isRegisterModalVisible" @close="closeRegisterModal" @register="registerPpc" />
  </div>
</template>

<script>
import axios from 'axios';
import ProductSidebar from '@/components/sidebar/ProductSidebar.vue';
import EditDeleteModal from '@/components/Modal.vue';
import RegisterModal from '@/components/RegisterModal.vue';

export default {
  components: {
    ProductSidebar,
    EditDeleteModal,
    RegisterModal,
  },
  data() {
    return {
      ppcs: [],
      isModalVisible: false,
      currentItem: null,
      isEditing: false,
      isRegisterModalVisible: false,
    };
  },
  methods: {
    fetchPpcs() {
      axios
        .get('/ppc/all')
        .then((response) => {
          this.ppcs = response.data;
        })
        .catch((error) => {
          console.error('상품 가격 정보를 가져오는데 실패했습니다:', error);
        });
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
        .put(`/ppc/update/${updatedPpc.proCode}`, updatedPpc)
        .then(() => {
          this.fetchPpcs();
          this.closeModal();
        })
        .catch((error) => {
          console.error('상품 가격 정보를 업데이트하는데 실패했습니다:', error);
        });
    },
    deletePpc(deletedPpc) {
      axios.delete(`/ppc/${deletedPpc.proCode}`)
        .then(() => {
          this.fetchPpcs();
          this.closeModal();
        })
        .catch((error) => {
          console.error('상품 가격 정보를 삭제하는데 실패했습니다:', error);
        });
    }
    ,
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
    float: right; /* 버튼을 오른쪽으로 이동시킵니다. */
  }
</style>