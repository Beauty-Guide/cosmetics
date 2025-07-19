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
import {Button} from "@/components/ui/button.tsx";
import {API_BASE_URL} from "@/config/consts.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

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
  isOpen, onOpenChange,
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
        setMainImageUrl(API_BASE_URL + mainImage.url)
        setMainImageId(mainImage.id)
      }

      // Извлекаем дополнительные изображения
      const additionalImages = initialData.images
        ?.filter((img) => !img.isMain)
        .map((img) => ({
          id: img.id,
          url: API_BASE_URL + img.url,
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[var(--container-4xl)] max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle >
              Редактирование косметики
            </DialogTitle>
          </DialogHeader>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {message && <div className="text-green-500 text-sm mb-4">{message}</div>}

          <form onSubmit={handleSave} className="space-y-6 py-4">
            {/* Основные поля */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
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
                      setCatalogId(selected.length > 0 ? parseInt(selected[0]) : null)
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

            {/* Совместимость */}
            <div className="border-t border-gray-300 pt-6">
              <h5 className="text-lg font-semibold">Совместимость</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                <Textarea
                    id="editCompatibility"
                    rows={3}
                    value={compatibility}
                    placeholder="Совместимость (RU)"
                    onChange={(e) => setCompatibility(e.target.value)}
                />
                <Textarea
                    id="editCompatibilityEN"
                    rows={3}
                    value={compatibilityEN}
                    placeholder="Совместимость (EN)"
                    onChange={(e) => setCompatibilityEN(e.target.value)}
                />
                <Textarea
                    id="editCompatibilityKR"
                    rows={3}
                    value={compatibilityKR}
                    placeholder="Совместимость (KR)"
                    onChange={(e) => setCompatibilityKR(e.target.value)}
                />
              </div>
            </div>

            {/* Рекомендации по применению */}
            <div className="border-t border-gray-300 pt-6">
              <h5 className="text-lg font-semibold">Рекомендации по применению</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                <Textarea
                    id="editUsage"
                    rows={3}
                    value={usageRecommendations}
                    placeholder="Рекомендации по применению (RU)"
                    onChange={(e) => setUsageRecommendations(e.target.value)}
                />
                <Textarea
                    id="editUsageEN"
                    rows={3}
                    value={usageRecommendationsEN}
                    placeholder="Рекомендации по применению (EN)"
                    onChange={(e) => setUsageRecommendationsEN(e.target.value)}
                />
                <Textarea
                    id="editUsageKR"
                    rows={3}
                    value={usageRecommendationsKR}
                    placeholder="Рекомендации по применению (KR)"
                    onChange={(e) => setUsageRecommendationsKR(e.target.value)}
                />
              </div>
            </div>

            {/* Способ применения */}
            <div className="border-t border-gray-300 pt-6">
              <h5 className="text-lg font-semibold">Способ применения</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                <Textarea
                    id="editApplication"
                    rows={3}
                    value={applicationMethod}
                    placeholder="Способ применения (RU)"
                    onChange={(e) => setApplicationMethod(e.target.value)}
                />
                <Textarea
                    id="editApplicationEN"
                    rows={3}
                    value={applicationMethodEN}
                    placeholder="Способ применения (EN)"
                    onChange={(e) => setApplicationMethodEN(e.target.value)}
                />
                <Textarea
                    id="editApplicationKR"
                    rows={3}
                    value={applicationMethodKR}
                    placeholder="Способ применения (KR)"
                    onChange={(e) => setApplicationMethodKR(e.target.value)}
                />
              </div>
            </div>

            {/* Рейтинг */}
            <div className="border-t border-gray-300 pt-6">
              <Slider
                  label="Рейтинг"
                  min={0}
                  max={100}
                  value={rating}
                  onValueChange={setRating}
              />
            </div>

            {/* Ссылки маркетплейсов */}
            <div className="border-t border-gray-300 pt-6">
              <MarketplaceLinksTable links={marketplaceLinks} onChange={setMarketplaceLinks} />
            </div>

            {/* Загрузка изображений */}
            <div className="border-t border-gray-300 pt-6">
              <h5 className="text-lg font-semibold mb-2">Изображения</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Input
                      id="formMainImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          if (toggleMainImageMarkForDeletion) toggleMainImageMarkForDeletion();
                          setMainImageFile(e.target.files[0]);
                          const url = URL.createObjectURL(e.target.files[0]);
                          setMainImageUrl(url);
                        }
                      }}
                  />
                  <small className="text-gray-500 mt-1 block">
                    Выберите главное изображение
                  </small>
                </div>
                <div>
                  <Input
                      id="formImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const newFiles = Array.from(files);
                          const newUrls = newFiles.map((file) => ({
                            id: "test",
                            url: URL.createObjectURL(file),
                          }));
                          setImageFiles((prev) => [...prev, ...newFiles]);
                          setImageUrls((prev) => [...prev, ...newUrls]);
                        }
                      }}
                      onClick={() => {
                        setImageUrls((prev) => prev.filter((img) => img.id !== "test"));
                      }}
                  />
                  <small className="text-gray-500 mt-1 block">
                    Можно выбрать несколько изображений
                  </small>
                </div>
              </div>

              {/* Предварительный просмотр */}
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
                        {imageUrls.map((img, index) => (
                            <div key={img.id} className="relative">
                              <img
                                  src={img.url}
                                  alt={`Изображение ${index + 1}`}
                                  className={`w-full h-40 object-cover rounded-md ${
                                      imagesMarkedForDeletion.some((i) => i.id === img.id)
                                          ? 'opacity-50 grayscale'
                                          : ''
                                  }`}
                              />
                              {img.id !== 'test' && (
                                  <button
                                      type="button"
                                      onClick={() => toggleImageMarkForDeletion(index)}
                                      className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2 py-1 text-xs"
                                  >
                                    {imagesMarkedForDeletion.some((i) => i.id === img.id)
                                        ? 'Восстановить'
                                        : 'Удалить'}
                                  </button>
                              )}
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Сохранить изменения</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default EditCosmeticModal;