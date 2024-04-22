<template>
  <h3>담당 거래처 목록</h3>
  <div class="client-list-container">
    <ul class="client-list">
      <li
        v-for="(client, index) in clients"
        :key="client.clientCode"
        @click="toggleDetails(client.clientCode)"
        :class="{ active: activeClient === client.clientCode }"
      >
        <div class="client-header">
          <h4>{{ client.clientName }}</h4>
          <span class="toggle-icon" :class="{ open: activeClient === client.clientCode }"></span>
        </div>
        <transition name="slide-fade">
          <div
            v-if="activeClient === client.clientCode"
            class="client-details"
          >
            <p><strong>대표명:</strong> {{ client.clientBoss }}</p>
            <p><strong>주소:</strong> {{ client.clientWhere }}</p>
            <p><strong>담당자:</strong> {{ client.clientEmp }}</p>
            <p><strong>전화번호:</strong> {{ client.clientEmpTel }}</p>
          </div>
        </transition>
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
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.client-list {
  list-style-type: none;
  padding: 0;
  position: relative;
}

.client-list > li {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.client-list > li:hover {
  transform: translateY(-5px);
}

.client-list > li.active {
  background-color: #e6f2ff;
}

.client-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.client-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.toggle-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-top: 2px solid #999;
  border-right: 2px solid #999;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.toggle-icon.open {
  transform: rotate(135deg);
}

.client-details {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
}

.client-list > li.active .client-details {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.client-details p {
  margin: 5px 0;
}

.client-details strong {
  font-weight: bold;
  color: #666;
}

h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* 슬라이드 페이드 트랜지션 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>