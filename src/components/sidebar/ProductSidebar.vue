<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter() // useRouter 훅을 사용합니다.


const navigateTo = (routeName) => {
  router.push({ name: routeName })
}


  const items = [
  { title: '상품 리스트 조회', icon: 'mail',routeName: 'viewproduct'  },
    { title: '거래처별 상품 관리', icon: 'dashboard' , children: [
    { title: '판매 상품 등록', icon: 'drafts', routeName: 'ppccrud' },
      { title: '판매 상품 리스트', icon: 'drafts', routeName: 'ppcview' },
    ] },
    { title: '재고 관리', icon: 'dashboard' , children: [
      { title: '재고 조회 및 등록', icon: 'send', routeName: 'stockList' },

    ] },
    { title: '출고 관리', icon: 'dashboard' , children: [
      { title: '전표 등록', icon: 'send' },
      { title: '전표 결재', icon: 'drafts' },
      { title: '전표 리스트 조회', icon: 'drafts' , routeName: 'viewvoucher'},
    ] }
  ]
</script>

<template>
  <div style="height: 500px">
    <VaSidebar>
      <VaAccordion>
        <template v-for="item in items">
          <VaCollapse
            v-if="item.children"
            :key="item.title + 'collapse'"
            body-color="#00000022"
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
