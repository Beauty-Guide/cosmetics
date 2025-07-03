import type { SkinType, SkinTypeView } from "../model/types"
import apiClient from "./adminApi" //

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

export const deleteSkinType = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/admin/skin-type/deleteSkinType/${id}`
    )
    if (response.status !== 200) {
      throw new Error("Ошибка удаления")
    }
  } catch (error) {
    throw new Error("Ошибка удаления")
  }
}
