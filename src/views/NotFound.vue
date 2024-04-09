<template>
    <div class="flex flex-col justify-between h-screen items-center bg-[var(--va-background-secondary)]">
      <RouterLink to="/">
        <VuesticLogo :gradient="false" class="my-8 h-5" />
      </RouterLink>
  
      <div class="flex flex-col items-center gap-6 px-4 my-8">
        <!-- Import된 이미지를 사용합니다. -->
        <img src="@/assets/404.gif" alt="Not Found Image" class="w-48 h-48" />
        <h1 class="va-h1 text-center sm:text-5xl text-4xl">Page not found</h1>
        <p class="text-center">
          The page you are looking for might have been removed had its name changed or is temporarily unavailable.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <VaButton to="/">Go to homepage</VaButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // NotFoundImage 컴포넌트가 필요하지 않으므로 제거합니다.
  </script>
  
  <style scoped>
  .flex-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  