import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API_BASE_URL } from "@/config/consts"
import { toast } from "sonner"
import apiClient from "@/services/adminApi"

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

  return useMutation({
    mutationFn: toggleFavProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getAllFavProducts"] })

      if (variables.action === "add") {
        toast.success("Добавлено в избранное")
      } else {
        toast.success("Удалено из избранного")
      }
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })
}
