import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import type { TCosmeticBag } from "@/types"
import { useQuery } from "@tanstack/react-query"

const fetchCosmeticBags = async (liked: boolean): Promise<TCosmeticBag[]> => {
  const response = await apiClient.get(
    `${API_BASE_URL}/api/bags${liked ? "/liked" : ""}`
  )
  return response.data
}
export const useCosmeticBags = ({ liked }: { liked: boolean }) => {
  return useQuery({
    queryKey: ["cosmeticBags"],
    queryFn: () => fetchCosmeticBags(liked),
  })
}
