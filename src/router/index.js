// 1. 引入内容
import { createRouter, createWebHashHistory } from 'vue-router'

// 2. 路由具体配置
const layout = () => import('@/views/layout.vue')
const home = () => import('@/views/home/index.vue')
const topCategory = () => import('@/views/category/index.vue')
const subCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/',
        component: home
      },
      {
        path: '/category/:id',
        component: topCategory
      },
      {
        path: '/category/sub/:id',
        component: subCategory
      }, {
        path: '/product/:id',
        component: Goods
      }
    ]
  },
  // 登录页
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

// vue2 new Router({})
// vue3 createRouter({})
// 3. 创建路由实例 路由配置内容放入
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 }
  }
})

// 4. 导出 在main.js里面进行具体挂载
export default router
