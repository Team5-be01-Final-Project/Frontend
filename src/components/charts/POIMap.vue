<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

function loadKakaoMapScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => resolve(kakao.maps);
    script.onerror = (error) => reject(error);
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=ec0714c866621428e42482a5174cd49c&libraries=services,clusterer,drawing&autoload=false';
    document.head.appendChild(script);
  });
}

async function fetchClients() {
  try {
    const response = await axios.get('http://localhost:8081/clients/list');
    return response.data;
  } catch (error) {
    console.error('거래처 정보를 가져오는 중 오류가 발생했습니다:', error);
    return [];
  }
}

async function displayMapWithClients() {
  await loadKakaoMapScript();
  kakao.maps.load(async () => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
      level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const clients = await fetchClients();

    clients.forEach(client => {
      new kakao.maps.services.Geocoder().addressSearch(client.clientWhere, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          new kakao.maps.Marker({
            map: map,
            position: coords,
            title: client.clientName
          });
        }
      });
    });
  });
}

onMounted(() => {
  displayMapWithClients();
});
</script>

<style>
/* 지도 컨테이너 스타일 */
#map {
  width: 100%;
  height: 400px;
}
</style>
