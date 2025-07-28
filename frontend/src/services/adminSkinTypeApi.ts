import type { SkinType, SkinTypeView } from "../model/types"
import apiClient from "@/api/apiClient"

export const addSkinType = async (skinType: SkinType): Promise<void> => {
  try {
    await apiClient.post("/admin/skin-type/addSkinType", skinType)
  } catch (error) {
    throw new Error("Ошибка добавления типа кожи")
  }
}

export const getAllSkinType = async (): Promise<SkinTypeView[]> => {
  try {
    const response = await apiClient.get("/admin/skin-type/getAllSkinType")
    return response.data
  } catch (error) {
    throw new Error("Ошибка при получении данных")
  }
}

export const updateSkinType = async (
  id: number,
  data: { name?: string; nameEN?: string; nameKR?: string }
): Promise<void> => {
  try {
    await apiClient.put(`/admin/skin-type/updateSkinType/${id}`, data)
  } catch (error) {
    throw new Error("Ошибка обновления типа кожи")
  }
}

export const deleteSkinType = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(
      `/admin/skin-type/deleteSkinType/${id}`
    )
    return response.status === 200
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw err.response.data
    }
    return false
  }
}
