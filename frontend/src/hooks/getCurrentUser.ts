import { API_BASE_URL } from "@/config/consts"
import type { TUser } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchCurrentUser = async (): Promise<TUser> => {
  const response = await axios.get(`${API_BASE_URL}/api/getUserInfo`)
  return response.data
}

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
  })
