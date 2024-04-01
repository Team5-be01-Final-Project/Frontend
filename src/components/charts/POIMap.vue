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
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=ec0714c866621428e42482a5174cd49c&autoload=false';
    document.head.appendChild(script);
  });
}

async function fetchClients() {
  try {
    const response = await axios.get('/clients/list');
    return response.data; // 서버로부터 받은 거래처 데이터
  } catch (error) {
    console.error('거래처 정보를 가져오는 중 오류가 발생했습니다:', error);
    return [];
  }
}

async function displayClientsOnMap() {
  await loadKakaoMapScript();
  kakao.maps.load(async () => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.54699, 127.09598), // 서울의 중심 좌표
      level: 4 // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const clients = await fetchClients();

    clients.forEach((client, index) => {
      new kakao.maps.services.Geocoder().addressSearch(client.clientWhere, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'; // 기본 마커 이미지
          if (index === 0) { // 매출 1등인 지점의 마커 이미지 변경 (첫 번째 거래처를 매출 1등으로 가정)
            imageSrc = 'https://cdn-icons-png.flaticon.com/512/4834/4834723.png';
          }

          const imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 크기
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage
          });
        }
      });
    });
  });
}

onMounted(() => {
  displayClientsOnMap();
});
</script>

<style>
/* 지도 컨테이너 스타일 */
#map {
  width: 100%;
  height: 400px;
}
</style>
