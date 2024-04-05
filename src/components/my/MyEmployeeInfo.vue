<!-- MyEmployeeInfo.vue -->
<template>
  <div class="employee-info-container">
    <div class="employee-photo">
      <img :src="employee.empImg" alt="사원 사진" />
    </div>
    <div class="employee-details">
      <div class="detail-row">
        <span class="label">사 원 명 : </span>
        <span class="value">{{ employee.empName }}</span>
      </div>
      <div class="detail-row">
        <span class="label">사원코드 : </span>
        <span class="value">{{ employee.empCode }}</span>
      </div>
      <div class="detail-row">
        <span class="label">연 락 처 : </span>
        <span class="value">{{ employee.empTel }}</span>
      </div>
      <div class="detail-row">
        <span class="label">이 메 일 : </span>
        <span class="value">{{ employee.empEmail }}</span>
      </div>
      <div class="detail-row">
        <span class="label">부 서 : </span>
        <span class="value">{{ employee.deptName }}</span>
      </div>
      <div class="detail-row">
        <span class="label">직 급 : </span>
        <span class="value">{{ employee.posName }}</span>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { defineProps } from "vue";

// props 정의를 통해 상위 컴포넌트로부터 사원 객체를 전달받음
const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
});
</script>
  
<style scoped>
/* 사원 정보를 표시하는 컨테이너 스타일 */
.employee-info-container {
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
}

/* 사원 사진을 위한 스타일 */
.employee-photo {
  margin-right: 20px; /* 사진과 정보 사이 간격 */
  width: 250px; /* 사진 너비 */
  height: 250px; /* 사진 높이 */
  overflow: hidden; /* 넘치는 이미지 숨김 처리 */
  border-radius: 50%; /* 원형 사진을 위한 설정 */
}

/* 사원 사진의 img 태그 스타일 */
.employee-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 사진의 비율 유지 및 채우기 */
}

/* 사원 상세 정보 스타일 */
.employee-details {
  background-color: #fff; /* 배경색 */
  padding: 20px; /* 내부 여백 */
  border-radius: 10px; /* 모서리 둥글게 처리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

/* 상세 정보의 각 행 스타일 */
.detail-row {
  display: flex;
  align-items: center; /* 가로 정렬 */
  margin-bottom: 10px; /* 행 사이 여백 */
}

/* 레이블 스타일 */
.label {
  font-weight: bold; /* 굵은 글씨 */
  color: #333; /* 글씨색 */
  margin-right: 10px; /* 레이블과 값 사이 간격 */
  width: 100px; /* 레이블 너비 고정 */
  text-align: right; /* 오른쪽 정렬 */
}

/* 값 스타일 */
.value {
  flex: 1; /* 남은 공간 모두 사용 */
}
</style>
