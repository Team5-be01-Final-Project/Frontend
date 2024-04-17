<template>
  <VaNavbar color="#ffffff">
    <template #left>
      <router-link to="/dashboard" class="hidden sm:block">
        <VaNavbarItem class="logo">
          <img src="@/assets/Logo.png" alt="Logo" style="width: 150px; height: auto;">
        </VaNavbarItem>
      </router-link>
    </template>


    <template #center>

      <router-link to="/dashboard" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          HOME
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/system/templog" class="hidden sm:block text-gray-600">
        <VaNavbarItem class="hidden sm:block">
          시스템 관리
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/product/viewproduct" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          제품 관리
        </VaNavbarItem>
      </router-link>

      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/sales/productsales" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          판매 관리
        </VaNavbarItem>
      </router-link>


      <VaNavbarItem class="navbar-item-slot">

      </VaNavbarItem>

      <router-link to="/business/viewclient" class="hidden sm:block">
        <VaNavbarItem class="hidden sm:block">
          영업 관리
        </VaNavbarItem>
      </router-link>

    </template>
    <template #right>
      <router-link to="/mysales" >
        <VaAvatar style="height: auto; margin-top: 5px;" :src="empImg" />
      </router-link>
      <div class="right-section">
        <p>{{ empName }}님 안녕하세요!</p>
      </div>
      <VaButton preset="secondary" color="textPrimary" href="https://github.com/Team5-be01-Final-Project"
        target="_blank" aria-label="Visit github">
        <img src="https://cdn.icon-icons.com/icons2/509/PNG/512/Github_icon-icons.com_49946.png" alt="GitHub Icon" />
      </VaButton>
      <VaButton preset="primary" @click="sitelogout"><VaIcon name="logout"/></VaButton>


    </template>
  </VaNavbar>
</template>


<script lang="ts" setup>
import { defineComponent, ref, onMounted } from 'vue';
import Cookies from 'js-cookie'; // js-cookie 임포트
import { VaAvatar } from 'vuestic-ui'; // VaAvatar 컴포넌트 임포트
import axios from 'axios';
import { useRouter } from 'vue-router';

const empName = ref('');
const empImg = ref(''); // empImg 데이터 속성 추가

const router = useRouter();

onMounted(() => {
  const name = Cookies.get('empName');
  const img = Cookies.get('empImg'); // 쿠키에서 empImg 값을 읽어옴

  if (name) {
    empName.value = name;
  }
  if (img) {
    empImg.value = img; // empImg 값이 존재하면 데이터 속성에 할당
  }
});

const sitelogout = async () => {
  try {
    // 백엔드 서버에 로그아웃 요청
    await axios.post('/logout')
    // 로그아웃 성공 시, 로그인 페이지로 리다이렉트
    router.push('/')
  } catch (error) {
    // 에러 처리
    console.error('로그아웃 에러:', error)
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: '05HanwhaGothicR';
  src: url('/src/assets/fonts/05HanwhaGothicR.ttf') format('truetype');
}
.va-navbar {
  z-index: 2;
  
}

  @media screen and (max-width: 950px) {
    .left {
      width: 100%;
    }

    .app-navbar__actions {
      display: flex;
      justify-content: space-between;
    }
  }


.left {
  display: flex;
  align-items: center;
  margin-left: 1rem;

  &>* {
    margin-right: 1rem;
  }

  &>*:last-child {
    margin-right: 0;
  }
}

img {
  width: 50px;  /* 이미지의 너비 조정 */
  height: auto; /* 이미지의 높이를 비율에 맞게 자동 조정 */
  border-radius: 10px; /* 이미지의 모서리를 둥글게 처리 */
}


.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: transform 0.5s ease;
}

.icon-fade-enter,
.icon-fade-leave-to {
  transform: scale(0.5);
}

.va-navbar__item {
  font-family: '05HanwhaGothicR', sans-serif !important;
  font-weight: normal;
  font-size: 18px; // Center 폰트 크기
  &:hover {
    // text-decoration: underline;
    transition: 0.2s all;
    border-bottom: 2px solid;
  }

  &.logo:hover {
    border-bottom: 0
  }
}
.right-section {
  display: flex;
  /* Flexbox 레이아웃 사용 */
  align-items: center;
  /* Flex 아이템들을 수직 방향으로 중앙 정렬 */
  gap: 10px;
  /* 아이템 사이의 간격 설정 */
  font-size: 18px;

}
.logout-button {
  margin-right: 20px; /* 로그아웃 버튼 우측 마진 설정 */
}
/* 추가적인 스타일링이 필요한 경우 여기에 추가 */


</style>