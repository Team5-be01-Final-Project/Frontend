<template>
  <div id="app">
    <NavigationBar v-if="!isLoginPage && !isNotFoundPage" class="navigation-bar" />
    <div class="main-content" v-if="!isMySalesPage && !isDashboardPage &&!isNotFoundPage">
      <RouterView />
    </div>
    <MySales v-else-if="isMySalesPage" />
    <Dashboard v-else-if="isDashboardPage" />
    <NotFound v-else-if="isNotFoundPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue';import { useRoute } from 'vue-router'
import NavigationBar from '@/components/navbar/NavigationBar.vue'
import Dashboard from '@/views/Dashboard.vue';
import MySales from '@/views/MySales.vue';
import NotFound from '@/views/NotFound.vue'

const route = useRoute();
const isLoginPage = computed(() => route.name === 'login');
const isMySalesPage = computed(() => route.name === 'mysales');
const isDashboardPage = computed(() => route.name === 'dashboard');
const isNotFoundPage = computed(() => route.name === 'not-found');
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