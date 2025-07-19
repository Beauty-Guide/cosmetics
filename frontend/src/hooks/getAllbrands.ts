import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

const fetchAllBrands = async ({ lang }: { lang: string }) => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllBrands`, {
    params: {
      lang,
    },
  })
  return response.data
}

export const useGetAllBrands = () => {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ["brands", i18n.language],
    queryFn: () => fetchAllBrands({ lang: i18n.language }),
    staleTime: Infinity,
  })
}
