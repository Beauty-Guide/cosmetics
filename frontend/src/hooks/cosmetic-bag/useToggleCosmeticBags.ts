import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import { queryClient } from "@/config/query-client"
import type { TCosmeticBag } from "@/types"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TToggleCosmeticBagAction = "add" | "remove"

type TToggleCosmeticBagData = {
  name: string
  action: TToggleCosmeticBagAction
  id?: string
}

const fetchToggleCosmeticBag = async (
  data: TToggleCosmeticBagData
): Promise<TCosmeticBag | null> => {
  if (data.action === "add") {
    const response = await apiClient.post(
      `${API_BASE_URL}/api/bags/createBug`,
      data
    )
    return response.data
  } else if (data.action === "remove") {
    const response = await apiClient.delete(
      `${API_BASE_URL}/api/bags/${data.id}`
    )
    return response.data
  }
  return null
}
export const useToggleCosmeticBag = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: TToggleCosmeticBagData) => fetchToggleCosmeticBag(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cosmeticBags"] })
      if (variables.action === "remove") {
        toast.success(t("cosmeticBag-delete-success"))
      } else if (variables.action === "add") {
        toast.success(t("cosmeticBag-create-success"))
      }
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
    },
  })
}
