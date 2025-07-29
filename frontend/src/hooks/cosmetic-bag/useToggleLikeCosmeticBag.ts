import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import { queryClient } from "@/config/query-client"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TToggleLikeCosmeticBag = {
  id: string
  action: "like" | "unlike"
}

const fetchToggleLikeCosmeticBag = async ({
  id,
  action,
}: TToggleLikeCosmeticBag) => {
  if (action === "like") {
    const res = await apiClient.post(`${API_BASE_URL}/api/bags/${id}/like`)
    return res.data
  } else if (action === "unlike") {
    const res = await apiClient.delete(`${API_BASE_URL}/api/bags/${id}/like`)
    return res.data
  }
}

export const useToggleLikeCosmeticBag = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: fetchToggleLikeCosmeticBag,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cosmeticBags"] })

      if (variables.action === "like") {
        toast.success(t("cosmeticBag-like-success"))
      } else if (variables.action === "unlike") {
        toast.success(t("cosmeticBag-unlike-success"))
      }
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
    },
  })
}
