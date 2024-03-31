<template>
    <div>
      <p v-if="srg10Temp !== null">현재 창고 온도: {{ srg10Temp }}°C</p>
      <button @click="fetchData">
        <i class="fas fa-sync-alt"></i> 새로고침
      </button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Warehouse',
    data() {
      return {
        srg10Temp: null, // SRG10의 온도를 저장하기 위한 데이터 속성
      };
    },
    mounted() {
      this.fetchData(); // 컴포넌트가 마운트될 때 데이터를 한 번 가져옵니다.
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('temp-logs');
          this.srg10Temp = response.data['SRG10']; // SRG10에 해당하는 데이터를 추출하여 저장합니다.
        } catch (error) {
          console.error('Error fetching SRG10 temperature:', error);
          this.srg10Temp = null; // 에러가 발생한 경우 온도 정보를 null로 설정
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 여기에 필요한 스타일을 추가하세요 */
  </style>
  