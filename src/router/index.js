import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login', // 'home' 대신 'login'으로 수정
      component: Login // 주석 제거
    },
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        const isAuthenticated = !!Cookies.get('empAuthCode');
        if (isAuthenticated) {
          next({ name: 'dashboard' });
        } else {
          next({ name: 'login' });
        }
      }
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('../views/BusinessView/BusinessLayout.vue'), // BusinessLayout.vue 추가
      children: [
        {
          path: 'clientsave',
          name: 'clientsave',
          component: () => import('../views/BusinessView/Clientsave.vue')
        },
        {
          path: 'viewclient',
          name: 'viewclient',
          component: () => import('../views/BusinessView/ViewClient.vue')
        },
        {
          path: 'ClientDetail/:clientCode',
          name: 'ClientDetail',
          component: () => import('../views/BusinessView/ClientDetail.vue')
        },
        {
          path: 'incentivelist',
          name: 'incentivelist',
          component: () => import('../views/BusinessView/IncentiveList.vue')
        }
      ]
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/ProductView/ProductLayout.vue'), // ProductLayout.vue 추가
      children: [
        {
          path: 'viewproduct',
          name: 'viewproduct',
          component: () => import('../views/ProductView/ViewProduct.vue')
        },
        {
          path: 'ppcview',
          name: 'ppcview',
          component: () => import('../views/ProductView/PpcView.vue')
        },
        {
          path: 'ppccrud',
          name: 'ppccrud',
          component: () => import('../views/ProductView/PpcCrud.vue')
        },
        {
          path: 'stockList',
          name: 'stockList',
          component: () => import('../views/ProductView/StockList.vue')
        },
        {
          path: 'viewvoucher',
          name: 'viewvoucher',
          component: () => import('../views/ProductView/ViewVoucher.vue')
        },
        {
          path: 'voucherdetail/:voucherID',
          name: 'VoucherDetail',
          component: () => import('../views/ProductView/VoucherDetail.vue')
        }
      ]
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView/SalesLayout.vue'), // SalesLayout.vue 추가
      children: [
        {
          path: 'clientsales',
          name: 'clientSales',
          component: () => import('../views/SalesView/ClientSales.vue')
        },
        {
          path: 'productsales',
          name: 'productsales',
          component: () => import('../views/SalesView/ProductSales.vue')
        }
      ]
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/SystemView/SystemLayout.vue'), // SystemLayout.vue 추가
      children: [
        {
          path: 'employeeslist',
          name: 'employeeslist',
          component: () => import('../views/SystemView/EmployeesList.vue')
        },
        {
          path: 'templog',
          name: 'templog',
          component: () => import('../views/SystemView/TempLog.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authCode = Cookies.get('empAuthCode');
  if (to.name === 'login') {
    next();
  } else {
    if (authCode) {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

export default router