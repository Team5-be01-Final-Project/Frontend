<template>
  <h4>이달의 우수지점</h4>
  <div id="map" style="width: 100%; height: 330px;"></div>
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
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=ec0714c866621428e42482a5174cd49c&autoload=false&libraries=services';
    document.head.appendChild(script);
  });
}

// 서버에서 거래처 정보와 매출 데이터를 가져오는 함수
async function fetchData() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0이 1월이므로 1을 더함
    const year = currentDate.getMonth() === 0 ? currentYear - 1 : currentYear;

    const [clientsResponse, salesResponse] = await Promise.all([
      axios.get('/clients/list'),
      axios.get(`/sales/Clientsales?year=${currentYear}&month=${currentMonth}`)
    ]);

    const clients = clientsResponse.data;
    const salesData = salesResponse.data;

    // 매출 1등 거래처 찾기
    const topSalesClient = salesData.reduce((prev, current) => (prev.voucSales > current.voucSales) ? prev : current);

    return { clients, topSalesClient };
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    return { clients: [], topSalesClient: null };
  }
}

// 지도에 거래처 위치를 마커로 표시하는 함수
async function displayClientsOnMap() {
  await loadKakaoMapScript();
  kakao.maps.load(async () => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.514183, 126.982484),
      level: 9
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    const { clients, topSalesClient } = await fetchData();

    clients.forEach((client) => {
      new kakao.maps.services.Geocoder().addressSearch(client.clientWhere, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          let imageSrc = client.clientName === topSalesClient.clientName
            ? 'https://cdn-icons-png.flaticon.com/512/4834/4834723.png'
            : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
          const markerImage = new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35));
          new kakao.maps.Marker({ map, position: coords, image: markerImage });
        }
      });
    });
  });
}

onMounted(() => {
  displayClientsOnMap();
});
</script>
