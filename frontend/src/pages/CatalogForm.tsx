import React, { useEffect, useState } from "react"
// API
import {
  addCatalog,
  deleteCatalog,
  getAllCatalogs,
  updateCatalog,
} from "../services/adminCatalogApi"
// Типы
import type { Catalog, Catalog1 } from "../model/types"
// UI
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal"
import FeedbackModal from "../components/admin/FeedbackModal"
import FilterCombobox from "@/components/HomeComponents/FilterCombobox.tsx"
// shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {PencilIcon, TrashIcon} from "@/components/modal/ActionIcons.tsx";


const CatalogForm: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [nameEN, setNameEN] = useState<string>("")
  const [nameKR, setNameKR] = useState<string>("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [catalogs, setCatalogs] = useState<Catalog1[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingCatalog, setEditingCatalog] = useState<Catalog1 | null>(null)
  const [editName, setEditName] = useState<string>("")
  const [editNameEN, setEditNameEN] = useState<string>("")
  const [editNameKR, setEditNameKR] = useState<string>("")
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
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEN?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameKR?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Введите название каталога (RU)")
      return
    }
    if (!nameEN.trim()) {
      setError("Введите название каталога (EN)")
      return
    }
    if (!nameKR.trim()) {
      setError("Введите название каталога (KR)")
      return
    }
    try {
      await addCatalog({ name, nameEN, nameKR, parentId })
      setMessage("Каталог успешно добавлен!")
      setError(null)
      setName("")
      setNameEN("")
      setNameKR("")
      setParentId(null)
      const updatedCatalogs = await getAllCatalogs()
      setCatalogs(updatedCatalogs)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingCatalog || !editName.trim() || !editNameEN.trim() || !editNameKR.trim()) return
    try {
      await updateCatalog(editingCatalog.id, {
        name: editName,
        nameEN: editNameEN,
        nameKR: editNameKR,
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
    setEditNameEN(catalog.nameEN || "")
    setEditNameKR(catalog.nameKR || "")
    setEditParentId(catalog.parent?.id || null)
    setShowEditModal(true)
  }

  const handleCloseModal = () => {
    setMessage(null)
    setError(null)
  }

  return (
      <div className="p-4 max-w-7xl mx-auto">
        {/* Card */}
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
          <h4 className="text-xl font-semibold text-center mb-4">
            Управление каталогами
          </h4>

          {/* Форма добавления */}
          <form onSubmit={handleSubmit} className="mb-6 grid gap-4">
            <div>
              <label
                  htmlFor="formCatalogName"
                  className="block text-sm font-medium text-gray-700 mb-1"
              >
                Каталог (RU)
              </label>
              <Input
                  id="formCatalogName"
                  placeholder="Введите название каталога"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>
            <div>
              <label
                  htmlFor="formCatalogNameEN"
                  className="block text-sm font-medium text-gray-700 mb-1"
              >
                Каталог (EN)
              </label>
              <Input
                  id="formCatalogNameEN"
                  placeholder="Введите название каталога"
                  value={nameEN}
                  onChange={(e) => setNameEN(e.target.value)}
                  required
              />
            </div>
            <div>
              <label
                  htmlFor="formCatalogNameKR"
                  className="block text-sm font-medium text-gray-700 mb-1"
              >
                Каталог (KR)
              </label>
              <Input
                  id="formCatalogNameKR"
                  placeholder="Введите название каталога"
                  value={nameKR}
                  onChange={(e) => setNameKR(e.target.value)}
                  required
              />
            </div>
            <div>
              <FilterCombobox
                  label="Родительский каталог"
                  options={[
                    { id: "", name: "— Без родителя —" },
                    ...catalogs.map((cat) => ({
                      id: String(cat.id),
                      name: cat.name,
                    })),
                  ]}
                  values={parentId ? [String(parentId)] : [""]}
                  onChange={(selectedIds) => {
                    const selectedId = selectedIds[0] || null
                    setParentId(selectedId ? Number(selectedId) : null)
                  }}
                  singleSelect
              />
            </div>
            <Button type="submit">Добавить каталог</Button>
          </form>

          {/* Поиск и заголовок на одной строке */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h5 className="font-medium text-lg">Текущая структура каталогов</h5>
            <div className="w-full md:w-64">
              <Input
                  placeholder="Поиск по каталогам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Сообщения */}
          <FeedbackModal message={message} error={error} onClose={handleCloseModal} />

          {/* Список каталогов */}
          {loading ? (
              <p>Загрузка данных...</p>
          ) : filteredCatalogs.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">
                Каталоги не найдены
              </div>
          ) : (
              <>
                {/* Таблица с shadcn/ui */}
                <Table className="mb-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Каталог (RU)</TableHead>
                      <TableHead>Каталог (EN)</TableHead>
                      <TableHead>Каталог (KR)</TableHead>
                      <TableHead>Родитель</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((catalog) => (
                        <TableRow key={catalog.id}>
                          <TableCell>{catalog.name}</TableCell>
                          <TableCell>{catalog.nameEN}</TableCell>
                          <TableCell>{catalog.nameKR}</TableCell>
                          <TableCell>{catalog.parent?.name || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(catalog)}
                              >
                                <PencilIcon />
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(catalog.id, catalog.name)}>
                                <TrashIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Пагинация */}
                <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredCatalogs.length)} из{" "}
                {filteredCatalogs.length}
              </span>
                  <div className="flex space-x-2">
                    <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                    >
                      Предыдущая
                    </Button>
                    <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={indexOfLastItem >= filteredCatalogs.length}
                        variant="outline"
                        size="sm"
                    >
                      Следующая
                    </Button>
                  </div>
                </div>
              </>
          )}
        </div>

        {/* Модальное окно редактирования */}
        {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
                    Каталог (RU)
                  </label>
                  <Input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Каталог (EN)
                  </label>
                  <Input
                      type="text"
                      value={editNameEN}
                      onChange={(e) => setEditNameEN(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Каталог (KR)
                  </label>
                  <Input
                      type="text"
                      value={editNameKR}
                      onChange={(e) => setEditNameKR(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <FilterCombobox
                      label="Родительский каталог"
                      options={[
                        { id: "", name: "— Без родителя —" },
                        ...catalogs.map((cat) => ({ id: String(cat.id), name: cat.name })),
                      ]}
                      values={editParentId !== null ? [String(editParentId)] : [""]}
                      onChange={(selectedIds) => {
                        const selectedId = selectedIds[0] || null
                        setEditParentId(selectedId ? Number(selectedId) : null)
                      }}
                      singleSelect
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                      onClick={() => setShowEditModal(false)}
                      variant="outline"
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleSaveEdit}>Сохранить</Button>
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