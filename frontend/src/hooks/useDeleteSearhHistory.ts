import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API_BASE_URL } from "@/config/consts"
import { toast } from "sonner"
import apiClient from "./apiClient"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"

const deleteSearchHistory = async (id: string) => {
  const response = await apiClient.get(
    `${API_BASE_URL}/api/deleteHistory/${id}`
  )
  return response.data
}

export const useDeleteSearchHistory = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => deleteSearchHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      toast.success(t("nav.search_history_deleted"))
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
      const status = error.status

      if (status === 401) {
        navigate("/login", { replace: true })
      }
    },
  })
}
