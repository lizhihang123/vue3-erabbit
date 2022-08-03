import { createProxyMiddleware } from 'http-proxy-middleware'
export default function (req, res) {
  const target = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 `/backend`
      // 例如 /backend/user/login 将被转发到 http://backend-api.com/user/login
      '^/backend/': '/'
    }
  })(req, res)
}
