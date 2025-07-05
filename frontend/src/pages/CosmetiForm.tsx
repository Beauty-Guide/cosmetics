import React, { useEffect, useState } from "react"
// API
// Импортируем методы получения данных
import { getAllBrands } from "../services/adminBrandApi"
import { getAllCatalogs } from "../services/adminCatalogApi"
import { getAllCosmeticActions } from "../services/adminCosmeticActionApi"
import { getAllSkinType } from "../services/adminSkinTypeApi"
import { getAllIngredients } from "../services/adminIngredientApi"
import { addCosmetic, getAllCosmetics } from "../services/adminCosmeticApi"

// Типы
import type {
  BrandView,
  Catalog,
  CosmeticActionView,
  CosmeticResponse,
  IngredientView,
  SkinTypeView,
} from "../model/types"
// Компоненты
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal"
import FeedbackModal from "../components/admin/FeedbackModal"

const CosmeticForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Состояния формы
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [brandId, setBrandId] = useState<number | "">("")
  const [catalogId, setCatalogId] = useState<number | "">("")
  const [compatibility, setCompatibility] = useState<string>("")
  const [usageRecommendations, setUsageRecommendations] = useState<string>("")
  const [applicationMethod, setApplicationMethod] = useState<string>("")
  const [actionIds, setActionIds] = useState<number[]>([])
  const [skinTypeIds, setSkinTypeIds] = useState<number[]>([])
  const [keyIngredientIds, setKeyIngredientIds] = useState<number[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

  // Состояние данных
  const [cosmetics, setCosmetics] = useState<CosmeticResponse[]>([])
  const [loadingCosmetics, setLoadingCosmetics] = useState<boolean>(true)

  // Состояние модальных окон
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false)
  const [cosmeticToDeleteId, setCosmeticToDeleteId] = useState<number | null>(
    null
  )
  const [cosmeticToDeleteName, setCosmeticToDeleteName] = useState<
    string | null
  >(null)

  // Справочники
  const [brands, setBrands] = useState<BrandView[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [actions, setActions] = useState<CosmeticActionView[]>([])
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([])
  const [ingredients, setIngredients] = useState<IngredientView[]>([])

  // Поиск и пагинация
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 30

  // Состояние сворачивания секций
  const [isOpen1, setIsOpen1] = useState<boolean>(true)
  const [isOpen2, setIsOpen2] = useState<boolean>(true)

  const [filteredIngredients, setFilteredIngredients] = useState<
    IngredientView[]
  >([])
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          brandData,
          catalogData,
          actionData,
          skinTypeData,
          ingredientData,
          cosmeticData,
        ] = await Promise.all([
          getAllBrands(),
          getAllCatalogs(),
          getAllCosmeticActions(),
          getAllSkinType(),
          getAllIngredients(),
          getAllCosmetics(),
        ])

        setBrands(brandData)
        setCatalogs(catalogData)
        setActions(actionData)
        setSkinTypes(skinTypeData)
        setIngredients(ingredientData)
        setCosmetics(cosmeticData.cosmetics)
        setFilteredIngredients(ingredientData)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
        console.error(err)
      } finally {
        setLoadingCosmetics(false)
      }
    }

    fetchData()
  }, [])

  // Фильтрация поискового запроса
  useEffect(() => {
    const filtered = ingredients.filter((ingr) =>
      ingr.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredIngredients(filtered)
  }, [searchTerm, ingredients])

  // Переключение выбранных ингредиентов
  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Фильтрация
  const filteredCosmetics = cosmetics.filter((cosmetic) =>
    [
      cosmetic.name,
      cosmetic.catalog?.name,
      cosmetic.brand?.name,
      ...cosmetic.actions.map((a) => a.name),
      ...cosmetic.skinTypes.map((s) => s.name),
      ...cosmetic.ingredients.map((i) => i.name),
    ].some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCosmetics.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const totalPages = Math.ceil(filteredCosmetics.length / itemsPerPage)

  // Обработчики событий
  const resetForm = () => {
    setName("")
    setDescription("")
    setBrandId("")
    setCatalogId("")
    setCompatibility("")
    setUsageRecommendations("")
    setApplicationMethod("")
    setActionIds([])
    setSkinTypeIds([])
    setKeyIngredientIds([])
    setImageFiles([])
  }

  const handleAddCosmetic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!brandId || !catalogId) {
      setError("Выберите бренд и каталог")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("brandId", brandId.toString())
    formData.append("catalogId", catalogId.toString())
    formData.append("compatibility", compatibility)
    formData.append("usageRecommendations", usageRecommendations)
    formData.append("applicationMethod", applicationMethod)
    actionIds.forEach((id) => formData.append("actionIds", id.toString()))
    skinTypeIds.forEach((id) => formData.append("skinTypeIds", id.toString()))
    keyIngredientIds.forEach((id) =>
      formData.append("keyIngredientIds", id.toString())
    )
    imageFiles.forEach((file) => formData.append("images", file))

    try {
      await addCosmetic(formData)
      setMessage("Косметика успешно добавлена!")
      setError(null)
      resetForm()
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении косметики")
      setMessage(null)
    }
  }

  const toggleArrayValue = (
    array: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    value: number
  ) => {
    if (array.includes(value)) {
      setter(array.filter((id) => id !== value))
    } else {
      setter([...array, value])
    }
  }

  const handleDelete = (id: number, name: string) => {
    setCosmeticToDeleteId(id)
    setCosmeticToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Карточка формы добавления */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление косметикой
        </h4>

        <form onSubmit={handleAddCosmetic} className="space-y-6">
          {/* Основные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="formName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Название
              </label>
              <input
                id="formName"
                type="text"
                placeholder="Введите название"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="formBrand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Бренд
              </label>
              <select
                id="formBrand"
                disabled={brands.length === 0}
                value={brandId}
                onChange={(e) => setBrandId(Number(e.target.value) || "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Выберите бренд --</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="formDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Описание
              </label>
              <textarea
                id="formDescription"
                rows={3}
                placeholder="Введите описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="formCatalog"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Каталог
              </label>
              <select
                id="formCatalog"
                disabled={catalogs.length === 0}
                value={catalogId}
                onChange={(e) => setCatalogId(Number(e.target.value) || "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Выберите каталог --</option>
                {catalogs.map((catalog) => (
                  <option key={catalog.id} value={catalog.id}>
                    {catalog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="formCompatibility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Совместимость
              </label>
              <textarea
                id="formCompatibility"
                rows={3}
                placeholder="Пример: Подходит для всех типов кожи"
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="formUsage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Рекомендации по применению
              </label>
              <textarea
                id="formUsage"
                rows={3}
                placeholder="Как использовать средство"
                value={usageRecommendations}
                onChange={(e) => setUsageRecommendations(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="formApplication"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Способ применения
              </label>
              <textarea
                id="formApplication"
                rows={3}
                placeholder="Пример: Нанести утром и вечером"
                value={applicationMethod}
                onChange={(e) => setApplicationMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="formImages"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Изображения
              </label>
              <input
                id="formImages"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImageFiles(Array.from(e.target.files))
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <small className="text-gray-500 mt-1">
                Можно выбрать несколько изображений
              </small>
            </div>
          </div>

          {/* Множественный выбор */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Действия
              </label>
              {actions.length === 0 ? (
                <p className="text-sm text-gray-500">Загрузка...</p>
              ) : (
                actions.map((action) => (
                  <div key={action.id} className="flex items-center mb-2">
                    <input
                      id={`action-${action.id}`}
                      type="checkbox"
                      checked={actionIds.includes(action.id)}
                      onChange={() =>
                        toggleArrayValue(actionIds, setActionIds, action.id)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`action-${action.id}`}
                      className="text-sm text-gray-700"
                    >
                      {action.name}
                    </label>
                  </div>
                ))
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Типы кожи
              </label>
              {skinTypes.length === 0 ? (
                <p className="text-sm text-gray-500">Загрузка...</p>
              ) : (
                skinTypes.map((type) => (
                  <div key={type.id} className="flex items-center mb-2">
                    <input
                      id={`skinType-${type.id}`}
                      type="checkbox"
                      checked={skinTypeIds.includes(type.id)}
                      onChange={() =>
                        toggleArrayValue(skinTypeIds, setSkinTypeIds, type.id)
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`skinType-${type.id}`}
                      className="text-sm text-gray-700"
                    >
                      {type.name}
                    </label>
                  </div>
                ))
              )}
            </div>

            <div className="p-4">
              {/* Селектор с множественным выбором и поиском */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ингредиенты
                </label>

                {/* Поле поиска */}
                <input
                  type="text"
                  placeholder="Поиск ингредиентов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Список ингредиентов */}
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white p-2">
                  {filteredIngredients.length === 0 ? (
                    <p className="text-sm text-gray-500 py-1">
                      Нет доступных ингредиентов
                    </p>
                  ) : (
                    filteredIngredients.map((ingr) => (
                      <div
                        key={ingr.id}
                        className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleIngredient(ingr.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIngredients.includes(ingr.id)}
                          onChange={() => toggleIngredient(ingr.id)}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {ingr.name}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Сообщения */}
          {message && <div className="text-green-600">{message}</div>}
          {error && <div className="text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Добавить косметику
          </button>
        </form>
      </div>

      {/* Карточка списка косметики */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Список косметики
        </h4>

        {/* Поиск и заголовок на одной строке */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Список косметики</h5>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Поиск по косметике..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Таблица косметики */}
        {loadingCosmetics ? (
          <p>Загрузка данных...</p>
        ) : filteredCosmetics.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            Нет доступной косметики
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Название
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Бренд
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Каталог
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Совместимость
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Рекомендации
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Способ применения
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Тип кожи
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((cosmetic) => (
                    <tr key={cosmetic.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.brand?.name || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.catalog?.name || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.compatibility || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.usageRecommendations || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.applicationMethod || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cosmetic.skinTypes.map((s) => s.name).join(", ") ||
                          "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {}}
                            title="Редактировать"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(cosmetic.id, cosmetic.name)
                            }
                            title="Удалить"
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Показано {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredCosmetics.length)} из{" "}
                  {filteredCosmetics.length}
                </span>
                <nav className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                  >
                    Предыдущая
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                  >
                    Следующая
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        onHide={() => setShowConfirmDeleteModal(false)}
        onConfirm={async () => {
          if (cosmeticToDeleteId !== null) {
            try {
              await deleteCosmetic(cosmeticToDeleteId)
              setCosmetics(cosmetics.filter((c) => c.id !== cosmeticToDeleteId))
              setMessage("Косметика успешно удалена")
              setError(null)
            } catch (err: any) {
              setError(err.message || "Ошибка при удалении")
              setMessage(null)
            } finally {
              setShowConfirmDeleteModal(false)
              setCosmeticToDeleteId(null)
              setCosmeticToDeleteName(null)
            }
          }
        }}
        itemName={cosmeticToDeleteName || undefined}
      />

      {/* Модальное окно сообщений */}
      <FeedbackModal
        message={message}
        error={error}
        onClose={() => setMessage(null)}
      />
    </div>
  )
}

export default CosmeticForm
