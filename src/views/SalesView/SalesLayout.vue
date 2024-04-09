<template>
    <div class="sales-layout">
      <h2>sales View</h2>
      <div class="sales-content">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SalesLayout'
  }
  </script>
  
  <style scoped>
  .sales-layout {
    padding: 20px;
  }
  
  </style>