import { API_BASE_URL } from "@/config/consts"
import type { TCategory } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

const fetchCategories = async ({
  lang,
}: {
  lang: string
}): Promise<TCategory[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllCatalog`, {
    params: {
      lang,
    },
  })
  return response.data
}

export const useGetCategories = () => {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ["categories", i18n.language],
    queryFn: () => fetchCategories({ lang: i18n.language }),
    staleTime: 1000 * 60 * 60,
  })
}
