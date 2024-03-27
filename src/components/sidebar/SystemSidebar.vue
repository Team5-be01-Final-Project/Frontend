<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeElement = ref('Address book')

const navigateTo = (routeName) => {
  if (routeName) {
    router.push({ name: routeName })
  }
}

const items = [
  { title: '사원 관리', icon: 'dashboard', children: [
    { title: '사원 리스트 조회', icon: 'send', routeName: 'employeeslist' },
    { title: '사원 정보 수정', icon: 'drafts' }, // 이 항목에 대한 라우트가 없습니다.
  ]},
  { title: '이상 온도 로그', icon: 'mail' }, // 이 항목에 대한 라우트가 없습니다.
]
</script>
<template>
  <div style="height: 500px">
    <VaSidebar>
      <VaAccordion>
        <template v-for="item in items" :key="item.title">
          <VaCollapse v-if="item.children" :key="item.title + 'collapse'" body-color="#00000022">
            <template #header="{ value: isCollapsed }">
              <VaSidebarItem :active="item.children.some((child) => child.title === activeElement)">
                <VaSidebarItemContent @click="activeElement = item.title">
                  <VaIcon :name="item.icon" />
                  <VaSidebarItemTitle>{{ item.title }}</VaSidebarItemTitle>
                  <VaSpacer />
                  <VaIcon :name="isCollapsed ? 'va-arrow-up' : 'va-arrow-down'" />
                </VaSidebarItemContent>
              </VaSidebarItem>
            </template>

            <template #body>
              <VaSidebarItem v-for="child in item.children" :key="child.title" :active="child.title === activeElement" @click="() => { activeElement = child.title; navigateTo(child.routeName); }">
                <VaSidebarItemContent>
                  <VaIcon :name="child.icon" />
                  <VaSidebarItemTitle>{{ child.title }}</VaSidebarItemTitle>
                </VaSidebarItemContent>
              </VaSidebarItem>
            </template>
          </VaCollapse>

          <VaSidebarItem v-else :key="item.title + 'item'" :active="item.title === activeElement" @click="() => { activeElement = item.title }">
            <VaSidebarItemContent>
              <VaIcon :name="item.icon" />
              <VaSidebarItemTitle>{{ item.title }}</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </template>
      </VaAccordion>

      <VaSpacer />

      <VaSidebarItem :active="'Settings' === activeElement" @click="() => { activeElement = 'Settings' }">
        <VaSidebarItemContent>
          <VaIcon name="settings" />
          <VaSidebarItemTitle>My 영업</VaSidebarItemTitle>
        </VaSidebarItemContent>
      </VaSidebarItem>
    </VaSidebar>
  </div>
</template>
