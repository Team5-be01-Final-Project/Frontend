<template>
  <div id="app">
    <NavigationBar v-if="!isLoginPage" class="navigation-bar" />
    <div class="main-content" v-if="!isMysalesPage && !isDashboardPage">
      <RouterView />
    </div>
    <MySales v-else-if="isMyalesPage" />
    <Dashboard v-else-if="isDashboardPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/navbar/NavigationBar.vue'
import Dashboard from '@/views/Dashboard.vue';
import MySales from '@/views/MySales.vue';

const route = useRoute();
const isLoginPage = computed(() => route.name === 'login');
const isMyalesPage = computed(() => route.name === 'mysales');
const isDashboardPage = computed(() => route.name === 'dashboard');
</script>

<style>
/* 네비게이션 바 스타일 */
.navigation-bar {
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0;
}
</style>