<!-- VoucherApproval.vue -->
<template>
  <div class="button-container">
    <button @click="$emit('approve')" v-if="$attrs.approve">승인</button>
    <button @click="$emit('reject')" v-if="$attrs.reject">반려</button>
  </div>
</template>
  
  <script>
export default {
  name: "VoucherApproval",
};
</script>
  
  <style scoped>
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.approve-button,
.reject-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.approve-button {
  background-color: #4caf50;
  color: white;
  margin-right: 10px;
}

.reject-button {
  background-color: #f44336;
  color: white;
}

.approve-button:hover,
.reject-button:hover {
  opacity: 0.8;
}
</style>