import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/viewproduct',
      name: 'viewproduct',
      component: () => import('../views/ViewProduct.vue')
    },
        {
          path: '/employeeslist',
          name: 'employeeslist',
          component: () => import('../views/EmployeesList.vue')
        },
        {
          path: '/ppcview',
          name: 'ppcview',
          component: () => import('../views/PpcView.vue')
        },
        {
          path: '/ppccrud',
          name: 'ppccrud',
          component: () => import('../views/PpcCrud.vue')
        },
        {
          path: '/clientsave',
          name: 'clientsave',
          component: () => import('../views/Clientsave.vue')
        },
        {
          path: '/viewclient',
          name: 'viewclient',
          component: () => import('../views/ViewClient.vue')
        },
        {
          path: '/ClientDetail/:clientCode',
          name: 'ClientDetail',
          component: () => import('../views/ClientDetail.vue')
        },
        {
          path: '/stockList',
          name: 'stockList',
          component: () => import('../views/StockList.vue')
        },
        {
          path: '/clientsales',
          name: 'clientSales',
          component: () => import('../views/ClientSales.vue')
        },   
        {
          path: '/viewvoucher',
          name: 'viewvoucher',
          component: () => import('../views/ViewVoucher.vue')
        }, 
        {
          path: '/voucherdetail/:voucherID', // 동적 세그먼트를 사용한 경로
          name: 'VoucherDetail',
          component: () => import('../views/VoucherDetail.vue')
        },
        {
          path: '/incentivelist',
          name: 'incentivelist',
          component: () => import('../views/IncentiveList.vue')
        }
      ]
    })


export default router