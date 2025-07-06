import { API_BASE_URL } from "@/config/consts"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllFavProducts = async (): Promise<TProduct[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/favorites`)
  return response.data
}

export const useGetAllFavProducts = () =>
  useQuery({
    queryKey: ["getAllFavProducts"],
    queryFn: fetchAllFavProducts,
  })
