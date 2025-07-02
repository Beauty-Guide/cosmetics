import axios, { type AxiosInstance } from "axios"

// Создаем общий экземпляр Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080", // URL Spring Boot backend
})

// Перехватчик запросов — добавляем токен из localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    console.log("Токен:", token)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
