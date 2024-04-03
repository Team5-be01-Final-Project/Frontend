<!-- Dashboard.vue -->
<template>
  <div class="main">
    <h3 class="va-h3">대시보드</h3>
  </div>
  <div>
    <!-- 기타 대시보드 내용 -->
    <Warehouse />
    <CarTempBarchart />
    <MonthSale/>
    
    <div>
      <label for="year">연도:</label>
      <select id="year" v-model="selectedYear">
        <option v-for="year in years" :value="year" :key="year">{{ year }}</option>
      </select>
      
      <label for="month">월:</label>
      <select id="month" v-model="selectedMonth">
        <option v-for="month in months" :value="month" :key="month">{{ month }}</option>
      </select>
    </div>
    
    <TopEmployee :year="selectedYear" :month="selectedMonth" />
  </div>
  <div><POI /><POIMap /></div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import CarTempBarchart from '@/components/charts/CarTempBarchart.vue';
import Warehouse from '@/components/charts/Warehouse.vue';
import POI from '@/components/charts/POI.vue';
import POIMap from '@/components/charts/POIMap.vue';
import MonthSale from '@/components/charts/MonthSale.vue';
import TopEmployee from '@/components/charts/TopEmployee.vue';

const currentYear = new Date().getFullYear();
const years = ref(Array.from({ length: 5 }, (_, i) => currentYear - i));
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));

const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
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