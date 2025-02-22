import axios from 'axios'
// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 基础URL
  timeout: 15000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // if (res.code !== 200) {
    //   // 处理错误情况
    //   return Promise.reject(new Error(res.message || '错误'))
    // }
    return res
  },
  (error) => {
    // 处理 HTTP 错误状态
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          break
        case 403:
          // 权限不足
          break
        case 404:
          // 请求不存在
          break
        default:
          // 其他错误
          break
      }
    }
    return Promise.reject(error)
  }
)

export default request 