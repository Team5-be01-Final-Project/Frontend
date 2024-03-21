<template>
  <VaButton
    preset="secondary"
    color="textPrimary"
    href="https://github.com/Team5-be01-Final-Project"
    target="_blank"
    aria-label="Visit github"
  >
    <VaIcon :component="VaIconGitHub" />
  </VaButton>
</template>

<script lang="ts" setup>
import VaIconGitHub from '../../icons/VaIconGitHub.vue'
</script>
