<template>
  <h3>담당 거래처 목록</h3>
  <div class="client-list-container">
    <ul class="client-list">
      <li
        v-for="(client, index) in clients"
        :key="client.clientCode"
        @click="toggleDetails(client.clientCode)"
      >
        <h4>{{ client.clientName }}</h4>
        <div v-if="activeClient === client.clientCode || (index === 0 && activeClient === null)" class="client-details">
          <p>대표명: {{ client.clientBoss }}</p>
          <p>주소: {{ client.clientWhere }}</p>
          <p>담당자: {{ client.clientEmp }}</p>
          <p>전화번호: {{ client.clientEmpTel }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  clients: {
    type: Array,
    required: true,
  },
});

const activeClient = ref(null);

const toggleDetails = (clientCode) => {
  if (activeClient.value === clientCode) {
    activeClient.value = null;
  } else {
    activeClient.value = clientCode;
  }
};
</script>

<style scoped>
.client-list-container {
  /* 이 컨테이너는 클라이언트 목록을 감싸는 블록입니다. */
}

.client-list {
  margin-top: 20px; /* 목록 상단의 여백 */
  list-style-type: none; /* 기본 리스트 스타일 제거 */
  padding: 0; /* 패딩 초기화 */
}

.client-list > li {
  background-color: #DEE5F2; /* 배경색 */
  margin-bottom: 5px; /* 항목간 하단 여백 */
  padding: 10px; /* 내부 패딩 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 마우스 오버 시 포인터 변경 */
}

.client-list > li > h4 {
  margin: 0; /* 제목 상하 여백 제거 */
}

.client-details {
  border-top: 1px solid #8ca4d0; /* 항목간 구분선 */
  padding-top: 10px; /* 구분선 위 여백 */
}
h3 {
  font-size: 20px;
  /* h4 태그의 폰트 사이즈를 키움 */
}
</style>
