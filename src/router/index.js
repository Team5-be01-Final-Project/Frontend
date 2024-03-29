import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,

    },
    {
      path: '/viewproduct',
      name: 'viewproduct',
      component: () => import('../views/ProductView/ViewProduct.vue')
    },
    {
      path: '/employeeslist',
      name: 'employeeslist',
      component: () => import('../views/SystemView/EmployeesList.vue')
    },
    {
      path: '/ppcview',
      name: 'ppcview',
      component: () => import('../views/ProductView/PpcView.vue')
    },
    {
      path: '/ppccrud',
      name: 'ppccrud',
      component: () => import('../views/ProductView/PpcCrud.vue')
    },
    {
      path: '/clientsave',
      name: 'clientsave',
      component: () => import('../views/BusinessView/Clientsave.vue')
    },
    {
      path: '/viewclient',
      name: 'viewclient',
      component: () => import('../views/BusinessView/ViewClient.vue')
    },
    {
      path: '/ClientDetail/:clientCode',
      name: 'ClientDetail',
      component: () => import('../views/BusinessView/ClientDetail.vue')
    },
    {
      path: '/stockList',
      name: 'stockList',
      component: () => import('../views/ProductView/StockList.vue')
    },
    {
      path: '/clientsales',
      name: 'clientSales',
      component: () => import('../views/SalesView/ClientSales.vue')
    },
    {
      path: '/viewvoucher',
      name: 'viewvoucher',
      component: () => import('../views/ProductView/ViewVoucher.vue')
    },
    {
      path: '/voucherdetail/:voucherID', // 동적 세그먼트를 사용한 경로
      name: 'VoucherDetail',
      component: () => import('../views/ProductView/VoucherDetail.vue')
    },
    {
      path: '/incentivelist',
      name: 'incentivelist',
      component: () => import('../views/BusinessView/IncentiveList.vue')
    },
    {
      path: '/productsales',
      name: 'productsales',
      component: () => import('../views/SalesView/ProductSales.vue')
    },
    {
      path: '/templog',
      name: 'templog',
      component: () => import('../views/SystemView/TempLog.vue')
    }
  ]
})


export default router