<!-- MyClientList.vue -->
<template>
  <div class="client-list-container">
    <h3>담당 거래처 목록</h3>
    <ul class="client-list">
      <li
        v-for="client in clients"
        :key="client.clientCode"
        @click="toggleDetails(client.clientCode)"
      >
        <h4>{{ client.clientName }}</h4>
        <div v-if="activeClient === client.clientCode" class="client-details">
          <p>대표자: {{ client.clientBoss }}</p>
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

// 부모 컴포넌트로부터 clients 배열을 props로 받습니다.
const props = defineProps({
  clients: {
    type: Array,
    required: true, // 필수 prop
  },
});

// 현재 활성화된(상세 정보가 표시된) 클라이언트를 추적하는 ref
const activeClient = ref(null);

// 클라이언트 코드를 기반으로 상세 정보의 표시 여부를 토글하는 함수
const toggleDetails = (clientCode) => {
  // 현재 활성화된 클라이언트가 다시 클릭된 경우, 활성화 상태를 해제합니다.
  if (activeClient.value === clientCode) {
    activeClient.value = null;
  } else {
    // 다른 클라이언트가 클릭된 경우, 해당 클라이언트의 상세 정보를 활성화합니다.
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
  background-color: #bad8f1; /* 배경색 */
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
</style>
