// 1. 引入内容
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

// 2. 路由具体配置
const layout = () => import('@/views/layout.vue')
const home = () => import('@/views/home/index.vue')
const topCategory = () => import('@/views/category/index.vue')
const subCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const cart = () => import('@/views/cart/index.vue')
const PayCheckOut = () => import('@/views/member/pay/checkout.vue')
const PayIndex = () => import('@/views/member/pay/index.vue')
const PayResult = () => import('@/views/member/pay/result.vue')
const memberHome = () => import('@/views/member/home')
const memberOrder = () => import('@/views/member/order')
const memberDetail = () => import('@/views/member/order/MemberDetail')
const memberLayout = () => import('@/views/member/pay/Layout')
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
      },
      // 购物车页面
      {
        path: '/cart',
        component: cart
      },
      {
        path: '/member',
        component: memberLayout,
        children: [
          {
            // 这里和上面一样
            path: '/member',
            component: memberHome
          },
          {
            path: '/member/order',
            component: { render: () => h(<RouterView></RouterView>) },
            children: [
              {
                path: '',
                component: memberOrder
              },
              {
                path: ':id',
                component: memberDetail
              }
            ]
          }
        ]
      }
    ]
  },
  // 登录页
  {
    path: '/login',
    component: Login,
    children: [
      {
        path: '/login/callback',
        component: LoginCallback
      }
    ]
  },
  {
    path: '/member/checkout',
    component: PayCheckOut
  },
  {
    path: '/member/pay',
    component: PayIndex
  },
  {
    path: '/pay/callback',
    component: PayResult
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

router.beforeEach((to, from, next) => {
  // 用户信息
  const { profile } = store.state.user
  // 如果没有token - 没有登录 且要去member开头的地址
  if (to.path.startsWith('/member') && !profile.token) {
    // 跳到登录页 同时 回跳的地址进行转码
    return next('login?redirectUrl=' + encodeURIComponent(to.fullPath))
    // return next({
    //   path: '/login',
    //   query: {
    //     redirectUrl: encodeURIComponent(to.fullPath)
    //   }
    // })
  }
  // 登录的话 通通放行
  next()
})

// 4. 导出 在main.js里面进行具体挂载
export default router
