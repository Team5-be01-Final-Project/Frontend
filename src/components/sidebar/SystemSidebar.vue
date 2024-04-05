<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeElement = ref(null) // 현재 활성화된 요소를 추적하기 위한 ref

// 모든 아코디언 항목의 열림 상태를 제어하기 위한 ref 배열
const collapseOpen = ref([true, true, true, true]) // 여기서 true의 개수는 아코디언 항목의 개수와 일치해야 합니다

const navigateTo = (routeName) => {
  if (routeName) {
    router.push({ name: routeName })
  }
}

const items = [
  { title: '사원 관리', icon: 'dashboard', children: [
    { title: '사원 리스트 조회', icon: 'send',routeName: 'employeesspec' },// 이 항목에 대한 라우트가 없습니다.
    { title: '사원 정보 수정', icon: 'drafts' ,routeName: 'employeeslist'}, 
  ]},
  { title: '이상 온도 로그', icon: 'mail',children: [
    { title: '창고 이상 온도 조회', icon: 'send', routeName: 'templog' },
  ]
 }, 
]
</script>

<template>
  <div style="height: 100vh">
    <VaSidebar>
      <VaAccordion multiple> <!-- 여기에 multiple 속성을 추가 -->
        <template v-for="(item, index) in items">
          <VaCollapse
            v-if="item.children"
            :key="item.title + 'collapse'"
            body-color="#00000022"
            v-model="collapseOpen[index]" 
          >
            <template #header="{ value: isCollapsed }">
              <VaSidebarItem :active="item.children.some((child) => child.title === activeElement)">
                <VaSidebarItemContent>
                  <VaIcon :name="item.icon" />
                  <VaSidebarItemTitle>{{ item.title }}</VaSidebarItemTitle>
                  <VaSpacer />
                  <VaIcon :name="isCollapsed ? 'va-arrow-up' : 'va-arrow-down'" />
                </VaSidebarItemContent>
              </VaSidebarItem>
            </template>

            <template #body>
              <VaSidebarItem
                v-for="child in item.children"
                :key="child.title"
                :active="child.title === activeElement"
                @click="() => {
              activeElement = child.title;
              if (child.routeName) navigateTo(child.routeName); // 라우팅 함수 호출
            }"
          >
                <VaSidebarItemContent>
                  <VaIcon :name="child.icon" />
                  <VaSidebarItemTitle>{{ child.title }}</VaSidebarItemTitle>
                </VaSidebarItemContent>
              </VaSidebarItem>
            </template>
          </VaCollapse>

          <VaSidebarItem
            v-else
            :key="item.title + 'item'"
            :active="item.title === activeElement"
            @click="activeElement = item.title"
          >
            <VaSidebarItemContent>
              <VaIcon :name="item.icon" />
              <VaSidebarItemTitle>{{ item.title }}</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </template>
      </VaAccordion>

      <VaSpacer />

      <VaSidebarItem
        :active="'Settings' === activeElement"
        @click="activeElement = 'Settings'"
      >
        <VaSidebarItemContent>
          <VaIcon name="settings" />
          <VaSidebarItemTitle>My 영업</VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </VaSidebar>
  </div>
</template>
