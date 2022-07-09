import router from '@/router'
import axios from 'axios'
import store from '@/store'

// 创建一个axios实例
// 导出基准地址
// 请求拦截器 如果有token 进行头部携带
// 响应拦截器 剥离多余的数据 处理token失效的问题
const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  config => {
    const { profile } = store.state.user
    // 如果有token 才进行头部的携带
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    if (err.response && err.response.status === 404) {
      // 清空用户数据
      store.commit('user/setUser', {})
      // 获取路由完整路径 并且解码 方便浏览器解析 进而重新跳转到登录页面
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
export default request
export const baseUrl = baseURL
