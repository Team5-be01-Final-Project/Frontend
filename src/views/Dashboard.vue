<template>
  <div class="main">
    <h3 class="va-h3">대시보드</h3>
  </div>
  <div>
    <!-- 기타 대시보드 내용 -->
    <Warehouse />
    <CarTempBarchart />
  </div>
  <div><POI /><POIMap /></div>
</template>

<script setup>
import axios from 'axios';
import CarTempBarchart from '@/components/charts/CarTempBarchart.vue';
import Warehouse from '@/components/charts/Warehouse.vue';
import POI from '@/components/charts/POI.vue';
import POIMap from '@/components/charts/POIMap.vue';

</script>

<style>
/* 여기에 스타일을 추가합니다. */
.va-table-responsive {
  overflow: auto;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 5px;
}

.va-table {
  min-width: 1000px;
}
</style>