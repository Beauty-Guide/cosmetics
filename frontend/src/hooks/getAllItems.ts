import { API_BASE_URL } from "@/config/consts"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type TGetAllItemsResponse = {
  cosmetics: TProduct[]
  total: number
}

type TProductFilters = {
  sortBy: string
  brandIds?: string[]
  catalogId?: string | null
  actionId?: string[]
  skinTypeIds?: string[]
  sortDirection?: string
  page: number
  size: number
}

const defaultFilters: TProductFilters = {
  sortBy: "id",
  page: 0,
  size: 10,
  brandIds: [],
  catalogId: null,
  actionId: [],
  skinTypeIds: [],
  sortDirection: "ASC",
}

const fetchAllItems = async (
  filters: TProductFilters
): Promise<TGetAllItemsResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/getCosmeticsByFilters`,
    filters
  )
  return response.data
}

export const useGetAllItems = (filters: TProductFilters) => {
  return useQuery({
    queryKey: ["items", filters],
    queryFn: () => fetchAllItems({ ...defaultFilters, ...filters }),
    staleTime: 30000,
  })
}
