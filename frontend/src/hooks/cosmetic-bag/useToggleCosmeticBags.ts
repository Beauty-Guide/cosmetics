import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import { queryClient } from "@/config/query-client"
import type { TCosmeticBag } from "@/types"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TCreateCosmeticBagData = {
  name: string
}

const fetchCreateCosmeticBag = async (
  data: TCreateCosmeticBagData
): Promise<TCosmeticBag> => {
  const response = await apiClient.post(
    `${API_BASE_URL}/api/bags/createBug`,
    data
  )
  return response.data
}
export const useCreateCosmeticBag = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: TCreateCosmeticBagData) => fetchCreateCosmeticBag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmeticBags"] })
      toast.success(t("bag.created"))
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
    },
  })
}
