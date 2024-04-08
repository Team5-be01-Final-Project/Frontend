<template>
    <div class="business-layout">
      <h2>Business View</h2>
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
  
  .business-content {
    margin-top: 20px;
    margin-left: 270px; 
  }
  </style>