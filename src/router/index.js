import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
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
        }
      ]
    }
  ]
})

export default router