import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllAction = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllCosmeticAction`)
  return response.data
}

export const useGetAllAction = () =>
  useQuery({
    queryKey: ["action"],
    queryFn: fetchAllAction,
    staleTime: Infinity,
  })
