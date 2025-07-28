import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API_BASE_URL } from "@/config/consts"
import { toast } from "sonner"
import apiClient from "../../api/apiClient"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"

type ToggleFavParams = {
  productId: string
  action: "add" | "remove"
}

const toggleFavProduct = async ({ productId, action }: ToggleFavParams) => {
  const url = `${API_BASE_URL}/api/favorites/${productId}/${action}`

  if (action === "add") {
    const response = await apiClient.post(url)
    return response.data
  } else {
    const response = await apiClient.delete(url)
    return response.data
  }
}

export const useToggleFavProduct = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: toggleFavProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getAllFavProducts"] })

      if (variables.action === "add") {
        toast.success(t("product.added_to_fav"))
      } else {
        toast.success(t("product.removed_from_fav"))
      }
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
