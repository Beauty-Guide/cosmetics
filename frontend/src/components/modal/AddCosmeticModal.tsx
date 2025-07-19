// src/components/admin/AddCosmeticModal.tsx
import React, { useState, useEffect } from "react"
import FilterCombobox from "@/components/HomeComponents/FilterCombobox"
import type {
  BrandView,
  Catalog,
  CosmeticActionView,
  IngredientView,
  SkinTypeView,
} from "@/model/types"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getAllCosmeticActions } from "@/services/adminCosmeticActionApi.ts"
import { getAllBrands } from "@/services/adminBrandApi.ts"
import { getAllCatalogsForAddCosmetic } from "@/services/adminCatalogApi.ts"
import { getAllSkinType } from "@/services/adminSkinTypeApi.ts"
import { getAllIngredients } from "@/services/adminIngredientApi.ts"
import { useSearchParams } from "react-router"
import { addCosmetic } from "@/services/adminCosmeticApi.ts"
import { uploadCosmeticImages } from "@/services/fileApi.ts"
import {Slider} from "@/components/ui/slider.tsx";
import MarketplaceLinksTable from "@/components/modal/MarketplaceLinksTable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

interface AddCosmeticModalProps {
  onAddSuccess: () => void
}

const AddCosmeticModal: React.FC<AddCosmeticModalProps> = ({
  onAddSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // Справочники
  const [brands, setBrands] = useState<BrandView[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [actions, setActions] = useState<CosmeticActionView[]>([])
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([])
  const [ingredients, setIngredients] = useState<IngredientView[]>([])

  // Состояния формы
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [compatibility, setCompatibility] = useState("")
  const [compatibilityEN, setCompatibilityEN] = useState("")
  const [compatibilityKR, setCompatibilityKR] = useState("")
  const [usageRecommendations, setUsageRecommendations] = useState("")
  const [usageRecommendationsEN, setUsageRecommendationsEN] = useState("")
  const [usageRecommendationsKR, setUsageRecommendationsKR] = useState("")
  const [applicationMethod, setApplicationMethod] = useState("")
  const [applicationMethodEN, setApplicationMethodEN] = useState("")
  const [applicationMethodKR, setApplicationMethodKR] = useState("")
  const [rating, setRating] = useState<number>(50)
  const [actionIds, setActionIds] = useState<number[]>([])
  const [skinTypeIds, setSkinTypeIds] = useState<number[]>([])
  const [keyIngredientIds, setKeyIngredientIds] = useState<number[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null) // Новое состояние для главного изображения
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>(
    searchParams.getAll("catalog")
  )
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    searchParams.getAll("skinType")
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    searchParams.getAll("ingredient")
  )
  const [selectedActions, setSelectedActions] = useState<string[]>(
    searchParams.getAll("actions")
  )
  const [marketplaceLinks, setMarketplaceLinks] = useState<
      { name: string; url: string; locale: string; id: number }[]
  >([]);

  // При открытии модального окна загружаем актуальные данные
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          brandData,
          catalogData,
          actionData,
          skinTypeData,
          ingredientData,
        ] = await Promise.all([
          getAllBrands(),
          getAllCatalogsForAddCosmetic(),
          getAllCosmeticActions(),
          getAllSkinType(), // ← убедитесь, что эта функция работает
          getAllIngredients(),
        ])
        console.log("skinTypes:", skinTypeData) // ← Логируем
        setBrands(brandData)
        setCatalogs(catalogData)
        setActions(actionData)
        setSkinTypes(skinTypeData)
        setIngredients(ingredientData)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
        console.error(err)
      }
    }
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const resetForm = () => {
    setName("")
    setDescription("")
    setBrands([])
    setSelectedBrands([])
    setCatalogs([])
    setSelectedCatalogs([])
    setCompatibility("")
    setCompatibilityEN("")
    setCompatibilityKR("")
    setUsageRecommendations("")
    setUsageRecommendationsEN("")
    setUsageRecommendationsKR("")
    setApplicationMethod("")
    setApplicationMethodEN("")
    setApplicationMethodKR("")
    setRating(50)
    setActionIds([])
    setSelectedActions([])
    setSkinTypes([])
    setSelectedSkinTypes([])
    setKeyIngredientIds([])
    setSelectedIngredients([])
    setMarketplaceLinks([])
    setImageFiles([])
    setMainImageFile(null) // Сбрасываем главное изображение
    setMainImageUrl(null)
    setImageUrls([])
  }

  const handleAddCosmetic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Вызываем валидацию
    if (!validateForm()) {
      return // Останавливаем выполнение, если форма невалидна
    }

    const actionIds = selectedActions.map(Number)
    const skinTypeIds = selectedSkinTypes.map(Number)
    const keyIngredientIds = selectedIngredients.map(Number)

    try {
      const cosmetic = {
        name,
        description,
        brandId: Number(selectedBrands[0]),
        catalogId: Number(selectedCatalogs[0]),
        compatibility,
        compatibilityEN,
        compatibilityKR,
        usageRecommendations,
        usageRecommendationsEN,
        usageRecommendationsKR,
        applicationMethod,
        applicationMethodEN,
        applicationMethodKR,
        rating: Array.isArray(rating) ? rating[0] : rating,
        actionIds,
        skinTypeIds,
        keyIngredientIds,
        marketplaceLinks
      }

      const response = await addCosmetic(cosmetic)
      console.log(response)

      if (!response || !response.data || !response.data.id) {
        setError("Не удалось получить ID новой косметики")
        return
      }

      // 2. Загружаем изображения, если они есть
      const imageUploadPromises: Promise<void>[] = []

      // Главное изображение
      if (mainImageFile) {
        imageUploadPromises.push(
          uploadCosmeticImages(response.data.id, [mainImageFile], true)
        )
      }

      // Дополнительные изображения
      if (imageFiles.length > 0) {
        imageUploadPromises.push(
          uploadCosmeticImages(response.data.id, imageFiles)
        )
      }

      // Ожидаем завершения всех загрузок
      await Promise.all(imageUploadPromises)

      setMessage("Косметика успешно добавлена!")
      setError(null)

      // Закрываем основное модальное окно через 500 мс
      setIsOpen(false)
      resetForm()
      // После закрытия основного окна — открываем окно успеха
      setTimeout(() => {
        setIsSuccessModalOpen(true)
      }, 500) // время должно совпадать с длительностью анимации/скрытия AddCosmeticModal

      onAddSuccess()
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении косметики")
    }
  }

  const validateForm = () => {
    // Проверяем текстовые поля
    if (!name.trim()) {
      setError("Поле 'Название' не должно быть пустым")
      return false
    }

    // Проверяем выпадающие списки (массивы)
    if (selectedBrands.length === 0) {
      setError("Выберите бренд")
      return false
    }
    if (selectedCatalogs.length === 0) {
      setError("Выберите каталог")
      return false
    }
      // ВАЛИДАЦИЯ ДЛЯ compatibility + многоязычности
      const isCompatibilityFilled =
          compatibility.trim() !== '' ||
          compatibilityEN.trim() !== '' ||
          compatibilityKR.trim() !== ''

      if (isCompatibilityFilled) {
          if (compatibility.trim() === '') {
              setError("Поле 'Совместимость (RU)' не должно быть пустым")
              return false
          }
          if (compatibilityEN.trim() === '') {
              setError("Поле 'Совместимость (ENG)' не должно быть пустым")
              return false
          }
          if (compatibilityKR.trim() === '') {
              setError("Поле 'Совместимость (KOR)' не должно быть пустым")
              return false
          }
      }
      // ВАЛИДАЦИЯ ДЛЯ usageRecommendations + многоязычности
      const isUsageRecommendationsFilled =
          usageRecommendations.trim() !== '' ||
          usageRecommendationsEN.trim() !== '' ||
          usageRecommendationsKR.trim() !== ''

      if (isUsageRecommendationsFilled) {
          if (usageRecommendations.trim() === '') {
              setError("Поле 'Рекомендации по применению (RU)' не должно быть пустым")
              return false
          }
          if (usageRecommendationsEN.trim() === '') {
              setError("Поле 'Рекомендации по применению (ENG)' не должно быть пустым")
              return false
          }
          if (usageRecommendationsKR.trim() === '') {
              setError("Поле 'Рекомендации по применению (KOR)' не должно быть пустым")
              return false
          }
      }

      // ВАЛИДАЦИЯ ДЛЯ applicationMethod + многоязычности
      const isApplicationMethodFilled =
          applicationMethod.trim() !== '' ||
          applicationMethodEN.trim() !== '' ||
          applicationMethodKR.trim() !== ''

      if (isApplicationMethodFilled) {
          if (applicationMethod.trim() === '') {
              setError("Поле 'Способ применения (RU)' не должно быть пустым")
              return false
          }
          if (applicationMethodEN.trim() === '') {
              setError("Поле 'Способ применения (ENG)' не должно быть пустым")
              return false
          }
          if (applicationMethodKR.trim() === '') {
              setError("Поле 'Способ применения (KOR)' не должно быть пустым")
              return false
          }
      }

    // Все проверки пройдены
    return true
  }

  return (
      <>
        <Button onClick={() => setIsOpen(true)} className="w-full">
          Добавить косметику
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="!max-w-[var(--container-4xl)] max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавление косметики</DialogTitle>
            </DialogHeader>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <form onSubmit={handleAddCosmetic} className="space-y-6 py-4">
              {/* Основные поля */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-1">
                    Название
                  </label>
                  <Input
                      id="formName"
                      type="text"
                      placeholder="Введите название"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <FilterCombobox
                    label="Бренд"
                    options={brands}
                    values={selectedBrands}
                    onChange={setSelectedBrands}
                    singleSelect
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <FilterCombobox
                    label="Каталог"
                    options={catalogs}
                    values={selectedCatalogs}
                    onChange={setSelectedCatalogs}
                    singleSelect
                />
                <FilterCombobox
                    label="Тип кожи"
                    options={skinTypes}
                    values={selectedSkinTypes}
                    onChange={setSelectedSkinTypes}
                />
                <FilterCombobox
                    label="Действия"
                    options={actions}
                    values={selectedActions}
                    onChange={setSelectedActions}
                />
                <FilterCombobox
                    label="Ингредиенты"
                    options={ingredients}
                    values={selectedIngredients}
                    onChange={setSelectedIngredients}
                />
              </div>

              <div className="space-y-6">
                <div className="border-t border-gray-300 pt-6">
                  <h5 className="text-lg font-semibold">Совместимость</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                    <Textarea
                        rows={3}
                        value={compatibility}
                        placeholder="Совместимость (RU)"
                        onChange={(e) => setCompatibility(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={compatibilityEN}
                        placeholder="Совместимость (EN)"
                        onChange={(e) => setCompatibilityEN(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={compatibilityKR}
                        placeholder="Совместимость (KR)"
                        onChange={(e) => setCompatibilityKR(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-6">
                  <h5 className="text-lg font-semibold">Рекомендации по применению</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                    <Textarea
                        rows={3}
                        value={usageRecommendations}
                        placeholder="Рекомендации по применению (RU)"
                        onChange={(e) => setUsageRecommendations(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={usageRecommendationsEN}
                        placeholder="Рекомендации по применению (EN)"
                        onChange={(e) => setUsageRecommendationsEN(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={usageRecommendationsKR}
                        placeholder="Рекомендации по применению (KR)"
                        onChange={(e) => setUsageRecommendationsKR(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-6">
                  <h5 className="text-lg font-semibold">Способ применения</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                    <Textarea
                        rows={3}
                        value={applicationMethod}
                        placeholder="Способ применения (RU)"
                        onChange={(e) => setApplicationMethod(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={applicationMethodEN}
                        placeholder="Способ применения (EN)"
                        onChange={(e) => setApplicationMethodEN(e.target.value)}
                    />
                    <Textarea
                        rows={3}
                        value={applicationMethodKR}
                        placeholder="Способ применения (KR)"
                        onChange={(e) => setApplicationMethodKR(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <Slider label="Рейтинг" min={0} max={100} value={rating} onValueChange={setRating} />
              </div>

              <div className="border-t border-gray-300 pt-6">
              <MarketplaceLinksTable
                  links={marketplaceLinks}
                  onChange={setMarketplaceLinks}
              />
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h5 className="text-lg font-semibold">Изображения</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div>
                    <Input
                        id="formMainImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setMainImageFile(e.target.files[0]);
                            const url = URL.createObjectURL(e.target.files[0]);
                            setMainImageUrl(url);
                          }
                        }}
                    />
                    <small className="text-gray-500 mt-1 block">Выберите главное изображение</small>
                  </div>
                  <div>
                    <Input
                        id="formImages"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            setImageFiles(Array.from(e.target.files));
                            const urls = Array.from(e.target.files).map((file) =>
                                URL.createObjectURL(file)
                            );
                            setImageUrls(urls);
                          }
                        }}
                    />
                    <small className="text-gray-500 mt-1 block">Можно выбрать несколько изображений</small>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="text-lg font-semibold mb-2">Предварительный просмотр:</h5>
                  {mainImageUrl && (
                      <div className="mb-2">
                        <strong>Главное изображение:</strong>
                        <img
                            src={mainImageUrl}
                            alt="Главное изображение"
                            className="w-full h-40 object-cover rounded-md mt-2"
                        />
                      </div>
                  )}
                  {imageUrls.length > 0 && (
                      <div>
                        <strong>Дополнительные изображения:</strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {imageUrls.map((url, index) => (
                              <div key={index}>
                                <img
                                    src={url}
                                    alt={`Изображение ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Добавить косметику</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default AddCosmeticModal;