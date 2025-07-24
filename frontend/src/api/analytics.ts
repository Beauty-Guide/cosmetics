import { API_BASE_URL } from "@/config/consts"
import axios from "axios"

type TAction = "VIEW" | "CLICK"
type TEvent = {
  action: TAction
  location: string | null
  device: string | null
  cosmeticId: string
}

export const postAnalyticsOnMarketPlaceURLClick = async (data: TEvent) => {
  await axios.post(`${API_BASE_URL}/api/analytics/event`, {
    ...data,
    brandIds: [],
    actionIds: [],
    skinTypeIds: [],
    query: "",
  })
}
