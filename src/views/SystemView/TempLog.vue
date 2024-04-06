<template>
    <div class="flex">
        <!-- 사이드바 섹션 -->
        <div class="sidebar">
            <SystemSidebar />
        </div>
  
        <div class = "Main">
            <table class="va-table va-table--hoverable full-width">
                <thead>
                    <tr>
                        <th>이상온도코드</th>
                        <th>창고구분</th>
                        <th>차량번호</th>
                        <th>이상온도</th>
                        <th>시간</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredData" :key="item.tempCode">
                        <td>{{ item.tempCode }}</td>
                        <td>{{ item.storageSeg }}</td>
                        <td>{{ item.storageCar }}</td>
                        <td>{{ item.tempTemp }}</td>
                        <td>{{ item.tempDate }}</td>
                        <td>{{ item.empName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import SystemSidebar from '@/components/sidebar/SystemSidebar.vue'
  
  export default {
      components: {
          SystemSidebar
      },
      data() {
          return {
              filteredData: []
          }
      },
      mounted() {
          this.fetchTempLogs();
      },
      methods: {
          async fetchTempLogs() {
              try {
                  const response = await axios.get(`/temp-logs/all`);
                  this.filteredData = response.data; // API에서 받아온 데이터를 직접 할당
              } catch (error) {
                  console.error("이상 온도 로그 데이터를 가져오는 중 에러가 발생했습니다.", error);
              }
          },
      }
  }
  </script>

<style>
.flex {
    display: flex;
}

.sidebar {
    width: 250px;
    /* 사이드바의 너비를 조절하세요 */
    /* 필요에 따라 추가 스타일링 */
}



.pagination {
    margin-top: 20px;
}

.pagination button {
    cursor: pointer;
    padding: 5px 10px;
    margin-right: 5px;
}

td.money-right {
    text-align: right;
}
.Main {
  flex-grow: 1;
  /* 메인 콘텐츠가 남은 공간을 모두 차지하도록 함 */
  /* 필요에 따라 추가 스타일링 */
}

.full-width {
  width: 100%;
  /* 테이블이 화면에 꽉 차도록 설정 */
}

</style>