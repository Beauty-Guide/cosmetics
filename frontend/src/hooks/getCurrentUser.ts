import { API_BASE_URL } from "@/config/consts"
import apiClient from "@/services/adminApi"
import type { TUser } from "@/types"
import { useQuery } from "@tanstack/react-query"

const fetchCurrentUser = async (): Promise<TUser> => {
  const response = await apiClient.get(`${API_BASE_URL}/api/getUserInfo`)
  return response.data
}

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 5,
  })
