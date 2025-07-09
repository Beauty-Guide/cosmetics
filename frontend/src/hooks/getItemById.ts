import { API_BASE_URL } from "@/config/consts"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

const fetchItemById = async (id: string, lang: string): Promise<TProduct> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/getCosmeticsById/${id}`,
    {
      params: {
        lang,
      },
    }
  )
  return response.data
}

export const useItemById = (id: string) => {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ["item", id, i18n.language],
    queryFn: () => fetchItemById(id, i18n.language),
    staleTime: 30000,
  })
}
