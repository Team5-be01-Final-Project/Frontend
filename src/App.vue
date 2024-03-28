<template>
  <div id="app">
    <NavigationBar class="navigation-bar" />
    <div class="main-content">
      <RouterView/>
      <!-- 메인 콘텐츠 영역, 현재 라우트에 해당하는 컴포넌트가 여기에 렌더링됩니다 -->
    </div>
  </div>
</template>



<script setup>
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/navbar/NavigationBar.vue'
</script>

<style>

/* 네비게이션 바 스타일 */
.navigation-bar {
  height: 60px; /* 네비게이션 바의 높이를 60px로 설정 */
  position: fixed; /* 고정 위치 */
  top: 0; /* 상단에 배치 */
  left: 0; /* 왼쪽에 배치 */
  width: 100%; /* 전체 너비 */
  z-index: 1000; /* 다른 요소들 위에 오도록 z-index 설정 */
  padding: 0; /* 네비게이션 바의 패딩 제거 */
  /* 추가 스타일링(배경색, 그림자 등) */
}

/* 메인 콘텐츠 영역 스타일 */
.main-content {
  margin-top: 60px; /* 네비게이션 바의 높이만큼 여백 설정 */
  padding: 0; /* 메인 콘텐츠 영역의 패딩 제거 */
  /* 추가 스타일링 */
}


</style>
