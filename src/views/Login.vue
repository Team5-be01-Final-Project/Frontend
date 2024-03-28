<template>
  <div class="login-wrapper">
    <div class="image-container">
      <img src="https://private-user-images.githubusercontent.com/149128094/317152126-a0eacf81-e777-462e-9781-e7ffd36e9e68.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE1MjA3MTEsIm5iZiI6MTcxMTUyMDQxMSwicGF0aCI6Ii8xNDkxMjgwOTQvMzE3MTUyMTI2LWEwZWFjZjgxLWU3NzctNDYyZS05NzgxLWU3ZmZkMzZlOWU2OC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzI3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMyN1QwNjIwMTFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03YTNlZDQwMGU4ZTBkNTFkMWRmOWQyYjZkNzEzMjc3ZGE1NWMzNzQxMTkzNWIyYjY5MmYwZGQ2YzZmOWQ1MTU2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.eH6uvMq4-_1w8Y0T-yR3Dfx9opo7xR3D4-vDkfu7v_o" alt="초기 화면">
    </div>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="사번">Employee Code:</label>
          <input v-model="empCode" type="text" id="empCode" required>
        </div>
        <div>
          <label for="비밀번호">Password:</label>
          <input v-model="empPw" type="password" id="empPw" required>
        </div>
        <button type="submit">Login</button>
        <p v-if="loginError" class="error-message">Invalid credentials. Please try again.</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      empCode: '',
      empPw: '',
      loginError: false
    };
  },
  methods: {
    async login() {
      console.log(`Logging in with Employee Code: ${this.empCode}, Password: ${this.empPw}`);
      try {
        const response = await axios.post('/api/login', {
          empCode: this.empCode,
          empPw: this.empPw
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
  background-color: #fff; /* 폼 배경색 추가 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
}

.error-message {
  color: red;
}

button[type="submit"] {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
