<template>
    <div class="product-layout">
      <h2>Product Management</h2>
      <div class="product-content">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductLayout'
  }
  </script>
  
  <style scoped>
  .product-layout {
    padding: 20px;
  }
  

  </style>