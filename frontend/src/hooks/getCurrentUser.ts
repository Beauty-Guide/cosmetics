import { API_BASE_URL } from "@/config/consts"
import apiClient from "../api/apiClient"
import type { TUser } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

const fetchCurrentUser = async (lang: string): Promise<TUser> => {
  const response = await apiClient.get(`${API_BASE_URL}/api/getUserInfo`, {
    params: {
      lang,
    },
  })
  return response.data
}

export const useCurrentUser = () => {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ["currentUser", i18n.language],
    queryFn: () =>
      fetchCurrentUser(i18n.language).catch((e) => {
        toast.error(`Ошибка авторизации ${e.code} ${e.status}`)
        return {
          name: "Unknown",
          role: "guest",
          history: null,
        }
      }),
    staleTime: 1000 * 5,
  })
}
