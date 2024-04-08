<template>
  <h4>현재 창고 온도</h4>
  <div class="warehouse-container">
    <div class="temperature-display">
      <p v-if="srg10Temp !== null">현재 창고 온도: {{ srg10Temp }}°C</p>
      <button class="refresh-button" @click="fetchData">
        <va-icon name="refresh" spin="clockwise"/>
      </button>
    </div>
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
.warehouse-container {
  background-color: #f0f0f0; /* 배경색을 회색으로 설정 */
  text-align: center; /* 이미지를 중앙 정렬 */
  padding: 10px;
}

h4 {
  font-size: 20px; /* h4 태그의 폰트 사이즈를 키움 */
}
.temperature-display {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; /* 온도를 나타내는 텍스트의 폰트 사이즈를 키움 */
}

.refresh-button {
  margin-left: 10px;
  display: flex; /* Flexbox를 사용하여 내용물을 중앙에 배치 */
  justify-content: center; /* 가로축 중앙 정렬 */
  align-items: center; /* 세로축 중앙 정렬 */
}

</style>