import apiClient from "./adminApi" //
import type { Ingredient, IngredientView } from "../model/types"

export const addIngredient = async (ingredient: Ingredient): Promise<void> => {
  try {
    await apiClient.post("/admin/ingredient/addIngredient", ingredient)
  } catch (error) {
    throw new Error("Ошибка добавления ингредиента")
  }
}

export const getAllIngredients = async (): Promise<IngredientView[]> => {
  try {
    const response = await apiClient.get("/admin/ingredient/getAllIngredient")
    return response.data
  } catch (error) {
    throw new Error("Ошибка при получении данных")
  }
}

export const deleteIngredient = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/admin/ingredient/deleteIngredient/${id}`
    )
    if (response.status !== 200) {
      throw new Error("Ошибка удаления")
    }
  } catch (error) {
    throw new Error("Ошибка удаления")
  }
}
