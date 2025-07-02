import apiClient from "./adminApi"

/**
 * Загрузка изображений для косметики
 */
export const addBrand = async (brand: { name: string }): Promise<void> => {
  await apiClient.post("/admin/brand/addBrand", brand)
}

export const uploadCosmeticImages = async (
  cosmeticId: number,
  files: File[]
): Promise<void> => {
  if (!files.length) {
    throw new Error("Нет изображений для загрузки")
  }

  // Используем Promise.all для обработки всех промисов
  await Promise.all(
    files.map(async (file) => {
      const formData = new FormData()
      formData.append("image", file)
      try {
        await apiClient.post(
          `/api/files/upload?cosmeticId=${cosmeticId}`,
          formData
        )
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Ошибка при загрузке изображений"

        throw new Error(message)
      }
    })
  )
}
