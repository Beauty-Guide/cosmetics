import apiClient from "@/api/apiClient"
import { type Catalog } from "../model/types"

export const addCatalog = async (catalog: Catalog): Promise<void> => {
  try {
    await apiClient.post("/admin/catalog/addCatalog", catalog)
  } catch (error) {
    throw new Error("Ошибка добавления каталога")
  }
}

export const getAllCatalogs = async (): Promise<Catalog[]> => {
  try {
    const response = await apiClient.get("/admin/catalog/getAllCatalogs")
    return response.data
  } catch (error) {
    throw new Error("Ошибка при получении данных")
  }
}

export const getAllCatalogsForAddCosmetic = async (): Promise<Catalog[]> => {
  try {
    const response = await apiClient.get(
      "/admin/catalog/getAllCatalogsForAddCosmetic"
    )
    return response.data
  } catch (error) {
    throw new Error("Ошибка при получении данных")
  }
}

export const updateCatalog = async (
  id: number,
  data: { name?: string; parentId?: number | null }
): Promise<any> => {
  try {
    const response = await apiClient.put(
      `/admin/catalog/updateCatalog/${id}`,
      data
    )
    return response.data
  } catch (error) {
    throw new Error("Ошибка при обновлении каталога")
  }
}

export const deleteCatalog = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/admin/catalog/deleteCatalog/${id}`
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
