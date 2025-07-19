import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

const fetchAllSkinType = async ({ lang }: { lang: string }) => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllSkinType`, {
    params: {
      lang,
    },
  })
  return response.data
}

export const useGetAllSkinType = () => {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ["skinType", i18n.language],
    queryFn: () => fetchAllSkinType({ lang: i18n.language }),
    staleTime: Infinity,
  })
}
