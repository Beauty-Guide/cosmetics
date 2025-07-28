import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import { queryClient } from "@/config/query-client"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TToggleCosmeticBagAction = "add" | "remove"
type ToggleCosmeticBag = {
  bagId: string
  action: TToggleCosmeticBagAction
  cosmeticId: string
}

const fetchToggleCosmeticBagProduct = async (data: ToggleCosmeticBag) => {
  if (data.action === "add") {
    const response = await apiClient.post(
      `${API_BASE_URL}/api/bags/${data.bagId}/cosmetics/${data.cosmeticId}`,
      data.bagId
    )
    return response.data
  } else if (data.action === "remove") {
    const response = await apiClient.delete(
      `${API_BASE_URL}/api/bags/${data.bagId}/cosmetics/${data.cosmeticId}`
    )
    return response.data
  }
  return null
}

export const useToggleCosmeticBagProduct = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: ToggleCosmeticBag) =>
      fetchToggleCosmeticBagProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmeticBags"] })
      toast.success(t("bag.product_added"))
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
    },
  })
}
