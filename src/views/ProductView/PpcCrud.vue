<template>
  <div class="flex">
    <!-- 사이드바 섹션 -->
    <div class="sidebar">
      <ProductSidebar />
    </div>
    <div class="ppc-page">
      <h1>거래처별 상품 가격 정보</h1>
      <div class="register-button-container">
        <button @click="openRegisterModal" class="register-button">
          판매상품 등록
        </button>
      </div>
      <table class="ppc-table">
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
            <td><button @click="openEditModal(ppc)">수정</button></td>
            <td><button @click="openDeleteModal(ppc.proCode)">삭제</button></td>
          </tr>
        </tbody>
      </table>
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
        .then(response => {
          this.ppcs = response.data;
        })
        .catch(error => {
          console.error('상품 가격 정보를 가져오는데 실패했습니다:', error);
        });
    },
    openEditModal(ppc) {
      this.currentItem = { ...ppc };
      this.isEditing = true;
      this.isModalVisible = true;
    },
    openDeleteModal(proCode) {
      this.currentItem = { proCode };
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
        .catch(error => {
          console.error('상품 가격 정보를 업데이트하는데 실패했습니다:', error);
        });
    },
    deletePpc(proCode) {
      axios
        .delete(`/ppc/${proCode}`)
        .then(() => {
          this.fetchPpcs();
          this.closeModal();
        })
        .catch(error => {
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
      // 서버로 등록 요청을 보냅니다.
      axios.post('/ppc/register', newPpc)
        .then(() => {
          // 요청이 성공하면 등록된 상품 목록을 다시 가져옵니다.
          this.fetchPpcs();
          // 등록 모달을 닫습니다.
          this.closeRegisterModal();
        })
        .catch(error => {
          // 요청이 실패하면 오류 메시지를 콘솔에 기록합니다.
          console.error('상품 가격 정보를 등록하는데 실패했습니다:', error);
          // 실패한 경우 사용자에게 알립니다.
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
/* 스타일 코드는 이전과 동일하므로 생략 */
</style>
