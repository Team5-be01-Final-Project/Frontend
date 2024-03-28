<template>
  <VaNavbar color="#ffffff">
    <template #left>
      <router-link to="/dashboard" class="hidden sm:block">
        <VaNavbarItem class="logo">
          <img src="@/assets/Logo.png" alt="Logo" style="width: 150px; height: auto;">
        </VaNavbarItem>
      </router-link>
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
      <VaButton preset="secondary" color="textPrimary" href="https://github.com/Team5-be01-Final-Project"
        target="_blank" aria-label="Visit github">
        <VaIcon :component="VaIconGitHub" />
      </VaButton>
    </template>
  </VaNavbar>
</template>

<script lang="ts" setup>
import VaIconGitHub from '@/components/icons/VaIconGitHub.vue'
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
</style>