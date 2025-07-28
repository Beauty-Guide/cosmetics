import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import type { TCosmeticBag } from "@/types"
import { useQuery } from "@tanstack/react-query"

type TCosmeticBags = {
  liked: boolean
  cosmeticId?: string
}

const fetchCosmeticBags = async ({
  liked,
  cosmeticId,
}: TCosmeticBags): Promise<TCosmeticBag[]> => {
  const response = await apiClient.get(
    `${API_BASE_URL}/api/bags${liked ? "/liked" : ""}`,
    {
      params: {
        cosmeticId,
      },
    }
  )
  return response.data
}
export const useCosmeticBags = (data: TCosmeticBags) => {
  return useQuery({
    queryKey: ["cosmeticBags"],
    queryFn: () => fetchCosmeticBags(data),
  })
}
