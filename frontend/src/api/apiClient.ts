import { API_BASE_URL } from "@/config/consts"
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios"

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}[] = []

const processQueue = (token: string | null, error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })

  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = "Bearer " + token
              }
              resolve(apiClient(originalRequest))
            },
            reject: (err) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          API_BASE_URL + "/api/refresh",
          {},
          {
            withCredentials: true,
          }
        )

        const newAccessToken = response.data.token
        localStorage.setItem("token", newAccessToken)
        processQueue(newAccessToken)
        isRefreshing = false

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken
        }

        return apiClient(originalRequest)
      } catch (err) {
        processQueue(null, err)
        isRefreshing = false
        localStorage.removeItem("token")
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
