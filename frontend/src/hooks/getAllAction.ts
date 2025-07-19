import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"

const fetchAllAction = async ({ lang }: { lang: string }) => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllCosmeticAction`, {
    params: {
      lang,
    },
  })
  return response.data
}

export const useGetAllAction = () => {
  const { i18n } = useTranslation()
  return useQuery({
    queryKey: ["action", i18n.language],
    queryFn: () => fetchAllAction({ lang: i18n.language }),
    staleTime: Infinity,
  })
}
