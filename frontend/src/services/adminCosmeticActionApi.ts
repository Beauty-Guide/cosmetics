import apiClient from "./adminApi" //
import type { CosmeticActionAdd, CosmeticActionView } from "../model/types"

export const addCosmeticAction = async (
  action: CosmeticActionAdd
): Promise<void> => {
  try {
    await apiClient.post("/admin/cosmetic-action/addCosmeticAction", action)
  } catch (error) {
    throw new Error("Ошибка добавления действия косметики")
  }
}

export const getAllCosmeticActions = async (): Promise<
  CosmeticActionView[]
> => {
  try {
    const response = await apiClient.get(
      "/admin/cosmetic-action/getAllCosmeticAction"
    )
    return response.data
  } catch (error) {
    throw new Error("Ошибка при получении данных")
  }
}

export const deleteCosmeticAction = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/admin/cosmetic-action/deleteCosmeticAction/${id}`
    )
    if (response.status !== 200) {
      throw new Error(response.data.message || "Ошибка удаления")
    }
  } catch (error: any) {
    let errorMessage = "Ошибка удаления"
    if (error.response?.data) {
      const serverError = error.response.data as { message?: string }
      errorMessage = serverError.message || errorMessage
    }
    throw new Error(errorMessage)
  }
}
