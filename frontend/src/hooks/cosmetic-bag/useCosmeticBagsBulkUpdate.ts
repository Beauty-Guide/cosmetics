import apiClient from "@/api/apiClient"
import { API_BASE_URL } from "@/config/consts"
import { queryClient } from "@/config/query-client"
import type { TCosmeticBag } from "@/types"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TCosmeticBagsBulkUpdate = {
  data: Pick<TCosmeticBag, "id" | "hasCosmetic">[]
  cosmeticId: string
}

const fetchCosmeticBagsBulkUpdate = async ({
  data,
  cosmeticId,
}: TCosmeticBagsBulkUpdate) => {
  const res = await apiClient.post(
    API_BASE_URL + `/api/bags/updateCosmeticInBags/${cosmeticId}`,
    data
  )
  return res.data
}

export const useCosmeticBagsBulkUpdate = () => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: fetchCosmeticBagsBulkUpdate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cosmeticBags", variables.cosmeticId],
      })
      toast.success(t("cosmeticBag-update-success"))
    },
    onError: (error: AxiosError) => {
      toast.error(error.message)
    },
  })
}
