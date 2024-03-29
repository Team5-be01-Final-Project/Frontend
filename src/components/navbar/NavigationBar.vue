<template>
  <VaNavbar color="#ffffff">
    <template #left>
      <VaNavbarItem class="logo">
        <img src="@/assets/Logo.png" alt="Logo" style="width: 150px; height: auto;">
      </VaNavbarItem>
    </template>
    <template #center>

      <router-link to="/dashboard" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          HOME
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/employeeslist" class="hidden sm:block text-gray-600">
        <VaNavbarItem class="hidden sm:block">
          시스템 관리
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/viewproduct" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          상품 관리
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/productsales" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          판매 관리
        </VaNavbarItem>
      </router-link>


      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/incentivelist" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          영업 관리
        </VaNavbarItem>
      </router-link>

    </template>
    <template #right>
      <VaButton @click="sitelogout">Logout</VaButton>
      <VaButton preset="secondary" color="textPrimary" href="https://github.com/Team5-be01-Final-Project"
        target="_blank" aria-label="Visit github">
        <VaIcon :component="VaIconGitHub" />
      </VaButton>
    </template>
  </VaNavbar>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import axios from 'axios';
import VaIconGitHub from '@/components/icons/VaIconGitHub.vue'
import { useRouter } from 'vue-router';



const router = useRouter()

const sitelogout = async () => {
  try {
    // 백엔드 서버에 로그아웃 요청
    await axios.post('/api/logout')
    // 로그아웃 성공 시, 로그인 페이지로 리다이렉트
    router.push('/')
  } catch (error) {
    // 에러 처리
    console.error('로그아웃 에러:', error)
  }
}



</script>

<style lang="scss" scoped>
.va-navbar {
  z-index: 2;

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      display: flex;
      justify-content: space-between;
    }
  }
}

.left {
  display: flex;
  align-items: center;
  margin-left: 1rem;

  &>* {
    margin-right: 1rem;
  }

  &>*:last-child {
    margin-right: 0;
  }
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: transform 0.5s ease;
}

.icon-fade-enter,
.icon-fade-leave-to {
  transform: scale(0.5);
}
.va-navbar__item:hover{
  // text-decoration: underline;
  transition: 0.2s all;
  border-bottom: 2px solid;
}
</style>