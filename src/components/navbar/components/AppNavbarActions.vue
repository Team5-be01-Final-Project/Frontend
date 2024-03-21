<template>
  <div class="app-navbar-actions">
    <GithubButton v-if="!isMobile" class="app-navbar-actions__item" />
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      href onclick="/src/pages/admin/dashboard/Dashboard.vue"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('Home') }}
    </VaButton>
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://discord.gg/u7fQdqQt8c"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('시스템관리') }}
    </VaButton>
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://admin.vuestic.dev/"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('상품관리') }}
    </VaButton>
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://admin.vuestic.dev/"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('판매관리') }}
    </VaButton>
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://admin.vuestic.dev/"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('영업관리') }}
    </VaButton>
  </div>
</template>

<script lang="ts" setup>
import GithubButton from './GitHubButton.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .app-navbar-actions__item {
    margin-right: 10px; /* 간격을 조정할 값 지정 */
  }

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
</style>
