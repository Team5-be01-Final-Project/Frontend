import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/clientsave',
      name: 'clientsave',
      component: () => import('../views/Clientsave.vue')
    },
    {
      path: '/viewproduct',
      name: 'viewproduct',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
    },{
      path: '/viewclient',
      name: 'viewclient',
      component: () => import('../views/ViewClient.vue')
    },{
      path: '/ClientDetail/:clientCode',
      name: 'ClientDetail',
      component: () => import('../views/ClientDetail.vue')
    }
  ]
})

export default router
