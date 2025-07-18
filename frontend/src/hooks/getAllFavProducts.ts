import { API_BASE_URL } from "@/config/consts"
import apiClient from "./apiClient"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"

const fetchAllFavProducts = async (): Promise<TProduct[]> => {
  const response = await apiClient.get(`${API_BASE_URL}/api/favorites`)
  return response.data
}

type TUseGetAllFavProductsOptions = {
  enabled?: boolean
}

export const useGetAllFavProducts = ({
  enabled = true,
}: TUseGetAllFavProductsOptions = {}) =>
  useQuery({
    queryKey: ["getAllFavProducts"],
    queryFn: fetchAllFavProducts,
    enabled,
    staleTime: Infinity,
  })
