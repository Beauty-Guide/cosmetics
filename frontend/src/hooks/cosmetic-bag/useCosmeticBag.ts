import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import type { TCosmeticBag } from "@/types"
import { useQuery } from "@tanstack/react-query"

type TResponse = {
  cosmeticBag: TCosmeticBag
  owner: boolean
}

const fetchCosmeticBag = async (id: string): Promise<TResponse> => {
  const response = await apiClient.get(
    `${API_BASE_URL}/api/bags/getCosmeticBag/${id}`
  )
  return response.data
}
export const useCosmeticBag = (id: string) =>
  useQuery({
    queryKey: ["cosmeticBag", id],
    queryFn: () => fetchCosmeticBag(id),
  })
