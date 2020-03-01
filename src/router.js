/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Firstpage from './components/Firstpage.vue'

import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'

import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'

import GoodsList from './components/goods/List.vue'
import Add from './components/goods/Add.vue'

import Order from './components/order/Order.vue'
import Report from './components/report/Report.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/firstpage',
      children: [
        { path: '/firstpage', component: Firstpage }, 
        { path: '/reports', component: Report },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/cate', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order }
      ]
    }
  ]
})

// 路由守卫 用于判断登录权限 
// 如果用户没有登录 并且试图用URL访问特定页面 则需要重新进入登录页面重新登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
