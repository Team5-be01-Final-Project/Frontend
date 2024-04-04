<template>
  <div class="login-wrapper">
    <div class="fixed-image">
      <img :src="loginImg" alt="Login Image" />
    </div>
  </div>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="empCode">Employee Code:</label>
        <input v-model="empCode" type="text" id="empCode" required>
      </div>
      <div>
        <label for="empPw">Password:</label>
        <input v-model="empPw" type="password" id="empPw" required>
      </div>

      <button type="submit">Login</button>
      <p v-if="loginError" class="error-message">Invalid credentials. Please try again.</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import loginImgPath from '@/assets/loginImg/1.jpg';
export default {
  name: 'LoginView',
  data() {
    return {
      loginImg: loginImgPath,
      empCode: '',
      empPw: '',
      loginError: false
    };
  },
  methods: {
    login: async () => { 
      console.log(`Logging in with Employee Code: ${this.empCode}, Password: ${this.empPw}`);
      try {
        const response = await axios.post('/api/login', {
          empCode: this.empCode,
          empPw: this.empPw
        });
        if (response.status === 200) {
          console.log("Login successful, redirecting to dashboard...");
          this.$router.push('/dashboard');
          console.log("Redirect attempted.");
        }

      } catch (error) {
        this.loginError = true;
      }
    }
  }
};
</script>

<style>
.fixed-image {
  background-image: url('@/assets/loginImg/1.jpg');
  /* 이미지 경로 확인 */
  background-size: 50%;
  /* 이미지 크기를 50%로 설정 */
  background-position: center center;
  /* 이미지를 중앙에 배치 */
  background-repeat: no-repeat;
  /* 이미지 반복 없음 */
  position: fixed;
  left: 0;
  top: 60px;
  /* 네비게이션 바 아래에 위치하도록 설정 */
  width: 100%;
  /* 전체 너비 */
  height: calc(100vh - 60px);
  /* 전체 높이에서 네비게이션 바 높이를 뺀 값 */
  z-index: -1;
}


.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ffffff;
  /* 폼 배경색 추가 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 그림자 효과 추가 */
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
