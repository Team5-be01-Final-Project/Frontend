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
  /* 여기에 컨테이너 스타일 추가 */
}

.client-list {
  list-style-type: none;
  padding: 0;
}

.client-list > li {
  background-color: #bad8f1;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.client-list > li > h4 {
  margin: 0;
}

.client-details {
  border-top: 1px solid #8ca4d0; /* 구분선 추가 */
  padding-top: 10px; /* 구분선 위 여백 추가 */
}
</style>
