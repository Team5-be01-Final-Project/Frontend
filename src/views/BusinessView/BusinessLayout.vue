<template>
    <div class="business-layout">
      <h2>Business Management</h2>
      <div class="business-content">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BusinessLayout'
  }
  </script>
  
  <style scoped>
  .business-layout {
    padding: 20px;
  }
  
  </style>