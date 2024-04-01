<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

onMounted(async () => {
  try {
    const { data: clients } = await axios.get('http://localhost:8081/clients/list');
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청을 기본 중심 좌표로 설정
      level: 7 // 지도의 확대 레벨 설정
    };
    
    const map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성

    clients.forEach(client => {
      new kakao.maps.services.Geocoder().addressSearch(client.clientWhere, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          new kakao.maps.Marker({
            map: map,
            position: coords
          });
          map.setCenter(coords); // 첫 번째 거래처 위치로 지도 중심 이동
        }
      });
    });
  } catch (error) {
    console.error('거래처 정보를 가져오는 중 오류가 발생했습니다:', error);
  }
});
</script>

<style>
/* 지도 컨테이너 스타일 */
#map {
  width: 100%;
  height: 400px;
}
</style>
