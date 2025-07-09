import { API_BASE_URL } from "@/config/consts"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

type TGetAllItemsResponse = {
  cosmetics: TProduct[]
  total: number
}

type TProductFilters = {
  sortBy?: string
  brandIds?: string[]
  catalogId?: string | null
  actionIds?: string[]
  skinTypeIds?: string[]
  sortDirection?: string
  page?: number
  size?: number
  name?: string | null
}

const defaultFilters: TProductFilters = {
  sortBy: "id",
  page: 0,
  size: 10,
  brandIds: [],
  catalogId: null,
  actionIds: [],
  skinTypeIds: [],
  sortDirection: "ASC",
  name: null,
}

const fetchAllItems = async (
  filters: TProductFilters,
  lang: string
): Promise<TGetAllItemsResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/getCosmeticsByFilters`,
    filters,
    {
      params: {
        lang,
      },
    }
  )
  return response.data
}

export const useGetAllItems = (filters: TProductFilters) => {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ["items", filters, i18n.language],
    queryFn: () =>
      fetchAllItems({ ...defaultFilters, ...filters }, i18n.language),
    staleTime: 30000,
  })
}
