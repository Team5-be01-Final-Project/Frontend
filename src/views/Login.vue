<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="empCode">Employee Code:</label>
        <input v-model="empCode" type="text" id="empCode" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>
      </div>
      <button type="submit">Login</button>
      <p v-if="loginError" class="error-message">Invalid credentials. Please try again.</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      empCode: '',
      password: '',
      loginError: false
    };
  },
  methods: {
    async login() {
      console.log(`Logging in with Employee Code: ${this.empCode}, Password: ${this.password}`);
      try {
        const response = await axios.post('/api/login', null, {
          params: {
            empCode: this.empCode,
            password: this.password
          },
        });
        if (response.status === 200) {
          this.$router.push('/home'); // 로그인 성공 시 /home 경로로 이동
        }
      } catch (error) {
        this.loginError = true;
      }
    }
  }
};
</script>

<style>
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: red;
}
</style>
