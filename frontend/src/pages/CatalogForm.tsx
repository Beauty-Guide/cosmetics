import React, { useEffect, useState } from "react"
// API
import {
  addCatalog,
  deleteCatalog,
  getAllCatalogs,
  updateCatalog,
} from "../services/adminCatalogApi"
// Компоненты
import CatalogTree from "../components/admin/CatalogTree"
// Типы
import type { Catalog, Catalog1 } from "../model/types"
// Компоненты UI
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

const CatalogForm: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [catalogs, setCatalogs] = useState<Catalog1[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingCatalog, setEditingCatalog] = useState<Catalog1 | null>(null)
  const [editName, setEditName] = useState<string>("")
  const [editParentId, setEditParentId] = useState<number | null>(null)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false)
  const [catalogToDeleteId, setCatalogToDeleteId] = useState<number | null>(
    null
  )
  const [catalogToDeleteName, setCatalogToDeleteName] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(true)

  // Поиск и пагинация
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Фильтрация данных
  const filteredCatalogs = catalogs.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCatalogs.slice(indexOfFirstItem, indexOfLastItem)

  // Загрузка данных
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const data = await getAllCatalogs()
        setCatalogs(data)
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить каталоги")
      } finally {
        setLoading(false)
      }
    }
    loadCatalogs()
  }, [])

  // Рекурсивное построение дерева (остаётся без изменений)
  const buildCatalogTree = (catalogs: Catalog[]): Catalog[] => {
    const map = new Map<number, Catalog>()
    const roots: Catalog[] = []

    catalogs.forEach((catalog) => {
      map.set(catalog.id!, { ...catalog, children: [] })
    })

    catalogs.forEach((catalog) => {
      const current = map.get(catalog.id!)
      if (!current) return

      if (catalog.parentId && map.has(catalog.parentId)) {
        const parent = map.get(catalog.parentId)!
        parent.children!.push(current)
      } else if (!catalog.parentId) {
        roots.push(current)
      }
    })

    return roots
  }

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите название каталога")
      return
    }

    try {
      await addCatalog({ name, parentId })
      setMessage("Каталог успешно добавлен!")
      setError(null)
      setName("")
      setParentId(null)
      const updatedCatalogs = await getAllCatalogs()
      setCatalogs(updatedCatalogs)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingCatalog || !editName.trim()) return

    try {
      await updateCatalog(editingCatalog.id, {
        name: editName,
        parentId: editParentId,
      })
      setMessage("Каталог успешно обновлён")
      setError(null)
      const updatedCatalogs = await getAllCatalogs()
      setCatalogs(updatedCatalogs)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  const handleDelete = async (id: number, name: string) => {
    setCatalogToDeleteId(id)
    setCatalogToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  const handleEditClick = (catalog: Catalog1) => {
    setEditingCatalog(catalog)
    setEditName(catalog.name)
    setEditParentId(catalog.parent?.id || null)
    setShowEditModal(true)
  }

  const handleCloseModal = () => {
    setMessage(null)
    setError(null)
  }

  // Для рендера опций в select
  const renderCatalogOptions = (
    catalogs: Catalog[],
    level = 0
  ): JSX.Element[] => {
    const prefix = "— ".repeat(level)
    return catalogs.reduce<JSX.Element[]>((acc, catalog) => {
      acc.push(
        <option key={catalog.id} value={catalog.id}>
          {prefix + catalog.name}
        </option>
      )
      if (catalog.children?.length) {
        acc.push(...renderCatalogOptions(catalog.children, level + 1))
      }
      return acc
    }, [])
  }

  const renderCatalogTableRows = (catalogs: Catalog1[]): JSX.Element[] => {
    return catalogs.map((catalog) => (
      <tr key={catalog.id}>
        <td className="border border-gray-300 px-4 py-2">{catalog.name}</td>
        <td className="border border-gray-300 px-4 py-2">
          {catalog.parent?.name || "—"}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEditClick(catalog)}
              title="Редактировать"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PencilIcon />
            </button>
            <button
              onClick={() => handleDelete(catalog.id, catalog.name)}
              title="Удалить"
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <TrashIcon />
            </button>
          </div>
        </td>
      </tr>
    ))
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Card */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление каталогами
        </h4>

        {/* Форма добавления */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-3">
            <label
              htmlFor="formCatalogName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Название каталога
            </label>
            <input
              id="formCatalogName"
              type="text"
              placeholder="Введите название каталога"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="formCatalogParent"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Родительский каталог
            </label>
            <select
              id="formCatalogParent"
              value={parentId || ""}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Без родителя —</option>
              {renderCatalogOptions(buildCatalogTree(catalogs))}
            </select>
          </div>
          <div className="md:col-span-5">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Добавить каталог
            </button>
          </div>
        </form>

        {/* Поиск и заголовок на одной строке */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Текущая структура каталогов</h5>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Поиск по каталогам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Сообщения */}
        <FeedbackModal
          message={message}
          error={error}
          onClose={handleCloseModal}
        />

        {/* Список каталогов */}
        {loading ? (
          <p>Загрузка данных...</p>
        ) : filteredCatalogs.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">
            Каталоги не найдены
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
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Родитель
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((catalog) => (
                    <tr key={catalog.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {catalog.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {catalog.parent?.name || "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(catalog)}
                            title="Редактировать"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(catalog.id, catalog.name)
                            }
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
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredCatalogs.length)} из{" "}
                {filteredCatalogs.length}
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
                  disabled={indexOfLastItem >= filteredCatalogs.length}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Редактировать каталог</h5>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Родительский каталог
              </label>
              <select
                value={editParentId || ""}
                onChange={(e) =>
                  setEditParentId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Без родителя —</option>
                {renderCatalogOptions(buildCatalogTree(catalogs))}
              </select>
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
          if (catalogToDeleteId !== null) {
            try {
              await deleteCatalog(catalogToDeleteId)
              const updatedCatalogs = await getAllCatalogs()
              setCatalogs(updatedCatalogs)
              setMessage("Каталог успешно удалён")
              setError(null)
            } catch (err: any) {
              setError(err.message || "Ошибка при удалении")
              setMessage(null)
            } finally {
              setShowConfirmDeleteModal(false)
              setCatalogToDeleteId(null)
              setCatalogToDeleteName(null)
            }
          }
        }}
        itemName={catalogToDeleteName || undefined}
      />
    </div>
  )
}

export default CatalogForm

export const buildCatalogTree = (catalogs: Catalog[]): Catalog[] => {
  const map = new Map<number, Catalog>()
  const roots: Catalog[] = []

  catalogs.forEach((catalog) => {
    map.set(catalog.id!, { ...catalog, children: [] })
  })

  catalogs.forEach((catalog) => {
    const current = map.get(catalog.id!)
    if (!current) return

    if (catalog.parentId && map.has(catalog.parentId)) {
      const parent = map.get(catalog.parentId)!
      parent.children!.push(current)
    } else if (!catalog.parentId) {
      roots.push(current)
    }
  })

  return roots
}
