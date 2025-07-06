import React, { useEffect, useState } from "react"
// API
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../services/adminBrandApi"
// Типы
import type { BrandView } from "../model/types"
// Компоненты
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal"
import FeedbackModal from "../components/admin/FeedbackModal"
// Иконки
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
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
)

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
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
)

const BrandForm: React.FC = () => {
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [brands, setBrands] = useState<BrandView[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Форма добавления
  const [name, setName] = useState<string>("")

  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingBrand, setEditingBrand] = useState<BrandView | null>(null)
  const [editName, setEditName] = useState<string>("")

  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false)
  const [brandToDeleteId, setBrandToDeleteId] = useState<number | null>(null)
  const [brandToDeleteName, setBrandToDeleteName] = useState<string | null>(
    null
  )

  // Поиск и пагинация
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Логика поиска
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Логика пагинации
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands()
        setBrands(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите название бренда")
      return
    }

    try {
      await addBrand({ name })
      setMessage("Бренд успешно добавлен!")
      setError("")
      setName("")
      const updatedBrands = await getAllBrands()
      setBrands(updatedBrands)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage("")
    }
  }

  const handleEditClick = (brand: BrandView) => {
    setEditingBrand(brand)
    setEditName(brand.name)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingBrand || !editName.trim()) return

    try {
      await updateBrand(editingBrand.id, { name: editName })
      setMessage("Бренд успешно обновлён")
      setError("")
      const updatedBrands = await getAllBrands()
      setBrands(updatedBrands)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  const handleDelete = async (id: number, name: string) => {
    setBrandToDeleteId(id)
    setBrandToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  const handleCloseModal = () => {
    setMessage("")
    setError("")
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Card */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление брендами
        </h4>

        {/* Форма добавления */}
        <form
          onSubmit={handleAddBrand}
          className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-3">
            <label
              htmlFor="formBrandName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Название бренда
            </label>
            <input
              id="formBrandName"
              type="text"
              placeholder="Введите название бренда"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Добавить бренд
            </button>
          </div>
        </form>

        {/* Поиск и заголовок на одной строке */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Список брендов</h5>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Поиск по брендам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Список брендов */}
        {loading ? (
          <p>Загрузка данных...</p>
        ) : filteredBrands.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            Нет доступных брендов
          </div>
        ) : (
          <>
            {/* Таблица */}
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Название
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((brand) => (
                    <tr key={brand.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {brand.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(brand)}
                            title="Редактировать"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id, brand.name)}
                            title="Удалить"
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredBrands.length)} из{" "}
                {filteredBrands.length}
              </span>
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                >
                  Предыдущая
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastItem >= filteredBrands.length}
                  className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                >
                  Следующая
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Редактировать бренд</h5>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        onHide={() => setShowConfirmDeleteModal(false)}
        onConfirm={async () => {
          if (brandToDeleteId !== null) {
            try {
              await deleteBrand(brandToDeleteId)
              const updatedBrands = await getAllBrands()
              setBrands(updatedBrands)
              setMessage("Бренд успешно удалён")
              setError(null)
            } catch (err: any) {
              setError(err.message || "Ошибка при удалении")
              setMessage(null)
            } finally {
              setShowConfirmDeleteModal(false)
              setBrandToDeleteId(null)
              setBrandToDeleteName(null)
            }
          }
        }}
        itemName={brandToDeleteName || undefined}
      />

      {/* Модальное окно сообщений */}
      <FeedbackModal
        message={message}
        error={error}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default BrandForm
