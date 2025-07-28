import { API_BASE_URL } from "@/config/consts"
import apiClient from "./apiClient"

type TAction = "VIEW" | "CLICK"
type TEvent = {
  action: TAction
  location: string | null
  device: string | null
  cosmeticId: string
  marketPlaceId: string
}

export const postAnalyticsOnMarketPlaceURLClick = async (data: TEvent) => {
  await apiClient.post(`${API_BASE_URL}/api/analytics/event`, data)
}
