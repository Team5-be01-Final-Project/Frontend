import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Cookies from 'js-cookie' // js-cookie 라이브러리를 임포트합니다.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        // 로그인 상태 확인
        const isAuthenticated = !!Cookies.get('empAuthCode');
        if (isAuthenticated) {
          // 이미 로그인한 경우 대시보드로 
          next({ name: 'dashboard' });
        } else {
          // 로그인하지 않은 경우 로그인 페이지로 
          next({ name: 'login' });
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
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
    }, {
      path: '/productsales',
      name: 'productsales',
      component: () => import('../views/SalesView/ProductSales.vue')
    }
  ]
})



router.beforeEach((to, from, next) => {
  const authCode = Cookies.get('empAuthCode'); // js-cookie를 사용해 쿠키에서 권한 코드를 가져옵니다.
  
  // 로그인 페이지는 항상 접근 가능하게 합니다.
  if (to.name === 'login') {
    next();
  } else {
    // 그 외의 페이지는 권한 코드가 필요합니다.
    if (authCode) {
      next(); // 권한 코드가 있으면 페이지 접근을 허용합니다.
    } else {
      next({ name: 'login' }); // 권한 코드가 없으면 로그인 페이지로 리디렉션합니다.
    }
  }
});


export default router