<template>
    <div class="system-layout">
      <h2>System View</h2>
      <div class="system-content">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SystemLayout'
  }
  </script>
  
  <style scoped>
  .system-layout {
    padding: 20px;
  }
 
  </style>