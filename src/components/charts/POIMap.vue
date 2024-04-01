<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

// 카카오 맵 API 스크립트를 동적으로 로드하는 함수
function loadKakaoMapScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => resolve(kakao.maps);
    script.onerror = (error) => reject(error);
    // 'libraries=services' 파라미터를 추가하여 Geocoder 서비스를 사용할 수 있도록 합니다.
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=ec0714c866621428e42482a5174cd49c&autoload=false&libraries=services';
 document.head.appendChild(script);
  });
}

// 서버에서 거래처 정보를 가져오는 함수
async function fetchClients() {
  try {
    // 상대 경로 대신 전체 경로를 사용합니다.
    const response = await axios.get('http://localhost:8081/clients/list');
    return response.data; // 서버로부터 받은 거래처 데이터
  } catch (error) {
    console.error('거래처 정보를 가져오는 중 오류가 발생했습니다:', error);
    return [];
  }
}

// 지도에 거래처 위치를 마커로 표시하는 함수
async function displayClientsOnMap() {
  await loadKakaoMapScript();
  kakao.maps.load(async () => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.514183, 126.982484), // 서울의 중심 좌표
      level: 9 // 지도의 확대 레벨
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const clients = await fetchClients();

    clients.forEach((client, index) => {
      // 주소 검색을 통해 좌표를 얻고 마커를 생성합니다.
      new kakao.maps.services.Geocoder().addressSearch(client.clientWhere, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          // 마커 이미지 선택: 매출 1등인 지점에는 특별한 이미지를 사용합니다.
          let imageSrc = index === 0 ? 'https://cdn-icons-png.flaticon.com/512/4834/4834723.png' : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
          const markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35));
          new kakao.maps.Marker({
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
