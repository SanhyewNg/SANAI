import axios from 'axios'
import { getAccessToken } from './authToken'

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
