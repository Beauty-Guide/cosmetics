import React, { useState, useEffect } from "react"
import FilterCombobox from "@/components/HomeComponents/FilterCombobox"
import type {
  BrandView,
  Catalog,
  CosmeticActionView,
  IngredientView, MarketplaceLink,
  SkinTypeView,
} from "@/model/types"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getAllCosmeticActions } from "@/services/adminCosmeticActionApi.ts"
import { getAllBrands } from "@/services/adminBrandApi.ts"
import { getAllCatalogsForAddCosmetic } from "@/services/adminCatalogApi.ts"
import { getAllSkinType } from "@/services/adminSkinTypeApi.ts"
import { getAllIngredients } from "@/services/adminIngredientApi.ts"
import { updateCosmetic } from "@/services/adminCosmeticApi"
import { uploadCosmeticImages } from "@/services/fileApi.ts"
import {Slider} from "@/components/ui/slider.tsx";
import MarketplaceLinksTable from "@/components/modal/MarketplaceLinksTable.tsx";

interface EditCosmeticModalProps {
  isOpen: boolean
  onClose: () => void
  onEditSuccess: () => void
  initialData: {
    id: number
    name: string
    brandId: number | null
    catalogId: number | null
    compatibility: string
    compatibilityEN: string
    compatibilityKR: string
    usageRecommendations: string
    usageRecommendationsEN: string
    usageRecommendationsKR: string
    applicationMethod: string
    applicationMethodEN: string
    applicationMethodKR: string
    actions: CosmeticActionView[]
    skinTypes: SkinTypeView[]
    ingredients: IngredientView[]
    images?: {
      id: string
      url: string
      isMain: boolean
    }[]
  }
}

const EditCosmeticModal: React.FC<EditCosmeticModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  initialData,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Справочники
  const [brands, setBrands] = useState<BrandView[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [actions, setActions] = useState<CosmeticActionView[]>([])
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([])
  const [ingredients, setIngredients] = useState<IngredientView[]>([])

  // Локальные данные формы
  const [name, setName] = useState(initialData?.name || "")
  const [brandId, setBrandId] = useState<number | null>(
    initialData?.brandId || null
  )
  const [catalogId, setCatalogId] = useState<number | null>(
    initialData?.catalogId || null
  )
  const [compatibility, setCompatibility] = useState(
    initialData?.compatibility || ""
  )
  const [compatibilityEN, setCompatibilityEN] = useState(
      initialData?.compatibilityEN || ""
  )
  const [compatibilityKR, setCompatibilityKR] = useState(
      initialData?.compatibilityKR || ""
  )
  const [usageRecommendations, setUsageRecommendations] = useState(
    initialData?.usageRecommendations || ""
  )
  const [usageRecommendationsEN, setUsageRecommendationsEN] = useState(
      initialData?.usageRecommendationsEN || ""
  )
  const [usageRecommendationsKR, setUsageRecommendationsKR] = useState(
      initialData?.usageRecommendationsKR || ""
  )
  const [applicationMethod, setApplicationMethod] = useState(
    initialData?.applicationMethod || ""
  )
  const [applicationMethodEN, setApplicationMethodEN] = useState(
    initialData?.applicationMethodEN || ""
  )
  const [applicationMethodKR, setApplicationMethodKR] = useState(
    initialData?.applicationMethodKR || ""
  )
  const [actionIds, setActionIds] = useState<number[]>(
    initialData?.actions.map((a) => a.id) || []
  )
  const [skinTypeIdList, setSkinTypeIdList] = useState<number[]>(
    initialData?.skinTypes.map((s) => s.id) || []
  )
  const [ingredientIds, setIngredientIds] = useState<number[]>(
    initialData?.ingredients.map((i) => i.id) || []
  )
  const [rating, setRating] = useState(
      initialData?.rating || 50
  )
  const [marketplaceLinks, setMarketplaceLinks] = useState<MarketplaceLink[]>([]);
  // Изображения
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [mainImageId, setMainImageId] = useState<string | null>(null)
  const [imagesMarkedForDeletion, setImagesMarkedForDeletion] = useState<
    {
      id: string
      url: string
    }[]
  >([]) // Изображения, помеченные на удаление

  // Загрузка справочников
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
          getAllSkinType(),
          getAllIngredients(),
        ])
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

  // Предзагрузка данных при открытии модального окна
  useEffect(() => {
    if (isOpen && initialData) {
      setMessage(null)
      setError(null)
      setImagesMarkedForDeletion([])
      setName(initialData.name)
      setBrandId(initialData.brandId)
      setCatalogId(initialData.catalogId)
      setCompatibility(initialData.compatibility)
      setCompatibilityEN(initialData.compatibilityEN)
      setCompatibilityKR(initialData.compatibilityKR)
      setUsageRecommendations(initialData.usageRecommendations)
      setUsageRecommendationsEN(initialData.usageRecommendationsEN)
      setUsageRecommendationsKR(initialData.usageRecommendationsKR)
      setApplicationMethod(initialData.applicationMethod)
      setApplicationMethodEN(initialData.applicationMethodEN)
      setApplicationMethodKR(initialData.applicationMethodKR)
      setActionIds(initialData.actions.map((a) => a.id))
      setSkinTypeIdList(initialData.skinTypes.map((s) => s.id))
      setIngredientIds(initialData.ingredients.map((i) => i.id))
      setMarketplaceLinks(initialData.marketplaceLinks || []);
      // Извлекаем главное изображение
      const mainImage = initialData.images?.find((img) => img.isMain)
      if (mainImage) {
        setMainImageUrl("http://localhost:8080" + mainImage.url)
        setMainImageId(mainImage.id)
      }

      // Извлекаем дополнительные изображения
      const additionalImages = initialData.images
        ?.filter((img) => !img.isMain)
        .map((img) => ({
          id: img.id,
          url: "http://localhost:8080" + img.url,
        }))
      setImageUrls(additionalImages || [])
    }
  }, [isOpen, initialData])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Название не может быть пустым")
      return
    }
    try {
      const updatedCosmetic = {
        id: initialData.id,
        name,
        brandId: brandId || undefined,
        catalogId: catalogId || undefined,
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
        skinTypeIds: skinTypeIdList,
        keyIngredientIds: ingredientIds,
        imagesForDeletion: imagesMarkedForDeletion.map((img) => img.id),
        marketplaceLinks
      }
      console.log("updatedCosmetic", updatedCosmetic)

      await updateCosmetic(initialData.id, updatedCosmetic)

      // Загрузка новых изображений
      if (imageFiles.length > 0) {
        await uploadCosmeticImages(initialData.id, imageFiles)
        setImageFiles([])
      }
      if (mainImageFile) {
        await uploadCosmeticImages(initialData.id, [mainImageFile], true)
        setMainImageFile(null)
      }

      setMessage("Косметика успешно обновлена!")
      setTimeout(() => {
        onEditSuccess()
        onClose()
        setMainImageUrl(null)
        setImageUrls([])
      }, 500)
    } catch (err: any) {
      setError(err.message || "Ошибка при сохранении изменений")
    }
  }

  const toggleImageMarkForDeletion = (index: number) => {
    const image = imageUrls[index]
    const isMarkedForDeletion = imagesMarkedForDeletion.some(
      (img) => img.id === image.id
    )

    if (isMarkedForDeletion) {
      // Восстанавливаем изображение
      setImagesMarkedForDeletion(
        imagesMarkedForDeletion.filter((img) => img.id !== image.id)
      )
    } else {
      // Помечаем на удаление
      setImagesMarkedForDeletion([...imagesMarkedForDeletion, image])
    }
  }

  const toggleMainImageMarkForDeletion = () => {
    if (!mainImageId) return

    const isMarkedForDeletion = imagesMarkedForDeletion.some(
      (img) => img.id === mainImageId
    )

    if (isMarkedForDeletion) {
      // Восстанавливаем изображение
      setImagesMarkedForDeletion(
        imagesMarkedForDeletion.filter((img) => img.id !== mainImageId)
      )
    } else {
      // Помечаем на удаление
      setImagesMarkedForDeletion((prev) => [...prev, { id: mainImageId }])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div className="p-6">
          <h4 className="text-xl font-semibold text-center mb-6">
            Редактировать косметику
          </h4>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {message && (
            <div className="text-green-500 text-sm mb-4">{message}</div>
          )}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Основные поля */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Название
                </label>
                <Input
                  id="editName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              <FilterCombobox
                label="Бренд"
                options={brands}
                values={brandId ? [brandId.toString()] : []}
                onChange={(selected) =>
                  setBrandId(selected.length > 0 ? parseInt(selected[0]) : null)
                }
                singleSelect
              />
            </div>
            {/* Каталог, тип кожи */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <FilterCombobox
                label="Каталог"
                options={catalogs}
                values={catalogId ? [catalogId.toString()] : []}
                onChange={(selected) =>
                  setCatalogId(
                    selected.length > 0 ? parseInt(selected[0]) : null
                  )
                }
                singleSelect
              />
              <FilterCombobox
                label="Тип кожи"
                options={skinTypes}
                values={skinTypeIdList.map((id) => id.toString())}
                onChange={(selected) =>
                  setSkinTypeIdList(selected.map((id) => parseInt(id)))
                }
              />
            </div>
            {/* Действия, ингредиенты */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <FilterCombobox
                label="Действия"
                options={actions}
                values={actionIds.map((id) => id.toString())}
                onChange={(selected) =>
                  setActionIds(selected.map((id) => parseInt(id)))
                }
              />
              <FilterCombobox
                label="Ингредиенты"
                options={ingredients}
                values={ingredientIds.map((id) => id.toString())}
                onChange={(selected) =>
                  setIngredientIds(selected.map((id) => parseInt(id)))
                }
              />
            </div>
            {/* Совместимость, рекомендации, способ применения */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="editCompatibility" className="block text-sm font-medium text-gray-700 mb-1">
                  Совместимость (RU)
                </label>
                <Textarea
                    id="editCompatibility"
                    rows={3}
                    value={compatibility}
                    onChange={(e) => setCompatibility(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="editCompatibilityEN" className="block text-sm font-medium text-gray-700 mb-1">
                  Совместимость (EN)
                </label>
                <Textarea
                    id="editCompatibilityEN"
                    rows={3}
                    value={compatibilityEN}
                    onChange={(e) => setCompatibilityEN(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editCompatibilityKR" className="block text-sm font-medium text-gray-700 mb-1">
                  Совместимость (KR)
                </label>
                <Textarea
                    id="editCompatibilityKR"
                    rows={3}
                    value={compatibilityKR}
                    onChange={(e) => setCompatibilityKR(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="editUsage" className="block text-sm font-medium text-gray-700 mb-1">
                  Рекомендации по применению (RU)
                </label>
                <Textarea
                    id="editUsage"
                    rows={3}
                    value={usageRecommendations}
                    onChange={(e) => setUsageRecommendations(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editUsageEN" className="block text-sm font-medium text-gray-700 mb-1">
                  Рекомендации по применению (EN)
                </label>
                <Textarea
                    id="editUsageEN"
                    rows={3}
                    value={usageRecommendationsEN}
                    onChange={(e) => setUsageRecommendationsEN(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editUsageKR" className="block text-sm font-medium text-gray-700 mb-1">
                  Рекомендации по применению (EN)
                </label>
                <Textarea
                    id="editUsageKR"
                    rows={3}
                    value={usageRecommendationsKR}
                    onChange={(e) => setUsageRecommendationsKR(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="editApplication" className="block text-sm font-medium text-gray-700 mb-1">
                  Способ применения (RU)
                </label>
                <Textarea
                    id="editApplication"
                    rows={3}
                    value={applicationMethod}
                    onChange={(e) => setApplicationMethod(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editApplicationEN" className="block text-sm font-medium text-gray-700 mb-1">
                  Способ применения (EN)
                </label>
                <Textarea
                    id="editApplicationEN"
                    rows={3}
                    value={applicationMethodEN}
                    onChange={(e) => setApplicationMethodEN(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editApplicationKR" className="block text-sm font-medium text-gray-700 mb-1">
                  Способ применения (KR)
                </label>
                <Textarea
                    id="editApplicationKR"
                    rows={3}
                    value={applicationMethodKR}
                    onChange={(e) => setApplicationMethodKR(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Slider
                  label="Райтинг"
                  min={0}
                  max={100}
                  value={rating}
                  onValueChange={setRating}
              />
            </div>

            {/* Marketplace Links Table */}
            <MarketplaceLinksTable
                links={marketplaceLinks}
                onChange={setMarketplaceLinks}
            />

            {/* Файлы для загрузки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="formMainImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Главное изображение
                </label>
                <Input
                  id="formMainImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      toggleMainImageMarkForDeletion()
                      setMainImageFile(e.target.files[0])
                      const url = URL.createObjectURL(e.target.files[0])
                      setMainImageUrl(url)
                    }
                  }}
                />
                <small className="text-gray-500 mt-1 block">
                  Выберите главное изображение
                </small>
              </div>
              <div>
                <label
                  htmlFor="formImages"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Изображения
                </label>
                {/*<Input*/}
                {/*    id="formImages"*/}
                {/*    type="file"*/}
                {/*    multiple*/}
                {/*    accept="image/*"*/}
                {/*    onChange={(e) => {*/}
                {/*      if (e.target.files) {*/}
                {/*        // Преобразуем файлы в массив*/}
                {/*        const newFiles = Array.from(e.target.files);*/}

                {/*        // Создаем новый массив для хранения объектов { id, url }*/}
                {/*        const newImageUrls = newFiles.map((file) => ({*/}
                {/*          id: "test", // Генерируем уникальный ID*/}
                {/*          url: URL.createObjectURL(file), // Создаем временный URL для предварительного просмотра*/}
                {/*        }));*/}

                {/*        // Обновляем состояние imageFiles и imageUrls*/}
                {/*        setImageFiles([...imageFiles, ...newFiles]);*/}
                {/*        setImageUrls([...imageUrls, ...newImageUrls]);*/}
                {/*      }*/}
                {/*    }}*/}
                {/*/>*/}
                <Input
                  id="formImages"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files
                    if (!files || files.length === 0) {
                      // Пользователь отменил выбор файлов
                      return
                    }
                    // Преобразуем файлы в массив
                    const newFiles = Array.from(files)
                    // Создаем новый массив для хранения объектов { id, url }
                    const newImageUrls = newFiles.map((file) => ({
                      id: "test", // Генерируем уникальный ID
                      url: URL.createObjectURL(file), // Создаем временный URL для предварительного просмотра
                    }))
                    // Обновляем состояние imageFiles и imageUrls
                    setImageFiles((prev) => [...prev, ...newFiles])
                    setImageUrls((prev) => [...prev, ...newImageUrls])
                  }}
                  onClick={() => {
                    setImageUrls((prev) =>
                      prev.filter((img) => img.id !== "test")
                    )
                  }}
                />
                <small className="text-gray-500 mt-1 block">
                  Можно выбрать несколько изображений
                </small>
              </div>
              {/* Изображения */}
              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-2">
                  Предварительный просмотр:
                </h5>
                {/* Главное изображение */}
                {mainImageUrl && (
                  <div className="mb-2">
                    <strong>Главное изображение:</strong>
                    <div className="relative">
                      <img
                        src={mainImageUrl}
                        alt="Главное изображение"
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}
                {/* Дополнительные изображения */}
                {imageUrls.length > 0 && (
                  <div>
                    <strong>Дополнительные изображения:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url.url}
                            alt={`Изображение ${index + 1}`}
                            className={`w-full h-40 object-cover rounded-md ${
                              imagesMarkedForDeletion.some(
                                (img) => img.id === url.id
                              )
                                ? "opacity-50 grayscale"
                                : ""
                            }`}
                          />
                          {url.id !== "test" && (
                            <button
                              type="button"
                              onClick={() => toggleImageMarkForDeletion(index)}
                              className="absolute top-0 right-0 text-white bg-red-500 rounded-full px-2 py-1 text-xs"
                            >
                              {imagesMarkedForDeletion.some(
                                (img) => img.id === url.id
                              )
                                ? "Восстановить"
                                : "Удалить"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCosmeticModal
