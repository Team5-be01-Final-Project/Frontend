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
      <p v-if="loginError" class="error-message">잘못된 정보입니다. 재시도 해주세요</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import loginImgPath from '@/assets/loginImg/1.jpg';
import Cookies from 'js-cookie';
Cookies.set('cookieName', 'value', { path: '/' }); 

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
    async login() {
      console.log(`Logging in with Employee Code: ${this.empCode}, Password: ${this.empPw}`);
      try {
        const response = await axios.post('/login', {
          empCode: this.empCode,
          empPw: this.empPw
        });
        if (response.status === 200) {
          console.log("Login successful, redirecting to dashboard...");
          // 쿠키 값 읽기
          const empCode = Cookies.get('empCode');
          const empName = Cookies.get('empName');
          const empImg = Cookies.get('empImg');
          const empAuthCode = Cookies.get('empAuthCode');
          console.log('Cookies:', empCode, empName, empImg, empAuthCode);
          this.$router.push('/dashboard');
          console.log("Redirect attempted.");
        }

      } catch (error) {
        this.loginError = true;
      }
    }
  },
  created() {
    this.login = this.login.bind(this);
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
  top: 0px;
  /* 네비게이션 바 아래에 위치하도록 설정 */
  width: 100%;
  /* 전체 너비 */
  height: calc(100vh - 60px);
  /* 전체 높이에서 네비게이션 바 높이를 뺀 값 */
  z-index: -1;
}


.login-container {
  max-width: 600px; /* 최대 너비를 500px에서 600px로 조정 */
  padding: 40px; /* 내부 패딩을 20px에서 40px로 조정 */
  border: 1px solid #ccc;
  border-radius: 10px; /* 모서리의 둥근 정도를 조금 더 증가 */
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}


.login-container div {
  display: flex;
  flex-direction: column;
  margin-top: 5px; /* 첫 번째 입력 필드 제외, 나머지 필드의 상단 간격 조정 */
}

.login-container div:first-child {
  margin-top: 0; /* 첫 번째 입력 필드의 상단 간격 제거 */
}
.login-container h2 {
  font-size: 24px; /* 로그인 제목의 폰트 크기 조정 */
  margin-bottom: 20px; /* 제목 아래의 여백 추가 */
}

.login-container label {
  font-size: 16px; /* 레이블의 폰트 크기 조정 */
  margin-bottom: 5px; /* 레이블과 입력 필드 사이의 여백 */
}

.login-container input[type="text"],
.login-container input[type="password"] {
  font-size: 16px; /* 입력 필드 내 텍스트의 폰트 크기 조정 */
  padding: 10px; /* 입력 필드 내부의 패딩 조정 */
  height: 40px; /* 입력 필드의 높이 조정 */
  margin-bottom: 15px; /* 입력 필드 간의 여백 추가 */
}

button[type="submit"] {
  padding: 15px; /* 버튼 내부의 패딩 조정 */
  font-size: 18px; /* 버튼 텍스트의 폰트 크기 조정 */
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
