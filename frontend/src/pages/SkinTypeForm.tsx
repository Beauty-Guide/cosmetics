import React, { useEffect, useState } from "react"
// API
import {
  addSkinType,
  deleteSkinType,
  getAllSkinType,
  updateSkinType,
} from "../services/adminSkinTypeApi"
// Типы
import type { SkinTypeView } from "../model/types"
// Компоненты
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal"
import FeedbackModal from "../components/admin/FeedbackModal"
// UI shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {PencilIcon, TrashIcon} from "@/components/modal/ActionIcons.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"

const SkinTypeForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingSkinType, setEditingSkinType] = useState<SkinTypeView | null>(
      null
  )
  const [editName, setEditName] = useState<string>("")
  const [editNameEN, setEditNameEN] = useState<string>("")
  const [editNameKR, setEditNameKR] = useState<string>("")
  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
      useState<boolean>(false)
  const [skinTypeToDeleteId, setSkinTypeToDeleteId] = useState<number | null>(
      null
  )
  const [skinTypeToDeleteName, setSkinTypeToDeleteName] = useState<
      string | null
  >(null)
  // Пагинация и поиск
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([])
  const [filteredSkinTypes, setFilteredSkinTypes] = useState<SkinTypeView[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  // Форма добавления
  const [name, setName] = useState<string>("")
  const [nameEN, setNameEN] = useState<string>("")
  const [nameKR, setNameKR] = useState<string>("")
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const data = await getAllSkinType()
        setSkinTypes(data)
        setFilteredSkinTypes(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }
    fetchSkinTypes()
  }, [])

  // Логика поиска
  useEffect(() => {
    const filtered = skinTypes.filter((type) =>
        [
          type.name,
          type.nameEN,
          type.nameKR,
        ].some(
            (value) =>
                value &&
                value.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    setFilteredSkinTypes(filtered)
    setCurrentPage(1)
  }, [searchQuery, skinTypes])

  // Логика пагинации
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSkinTypes.slice(
      indexOfFirstItem,
      indexOfLastItem
  )

  // Обработчики событий
  const handleAddSkinType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Введите тип кожи (RU)")
      return
    }
    if (!nameEN.trim()) {
      setError("Введите тип кожи (EN)")
      return
    }
    if (!nameKR.trim()) {
      setError("Введите тип кожи (KR)")
      return
    }
    try {
      await addSkinType({ name, nameEN, nameKR })
      setMessage("Тип кожи успешно добавлен!")
      setError("")
      const updatedTypes = await getAllSkinType()
      setSkinTypes(updatedTypes)
      setName("")
      setNameEN("")
      setNameKR("")
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage("")
    }
  }

  const handleEditClick = (type: SkinTypeView) => {
    setEditingSkinType(type)
    setEditName(type.name)
    setEditNameEN(type.nameEN)
    setEditNameKR(type.nameKR)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingSkinType || !editName.trim() || !editNameEN.trim() || !editNameKR.trim())
      return
    try {
      await updateSkinType(editingSkinType.id, {
        name: editName,
        nameEN: editNameEN,
        nameKR: editNameKR,
      })
      setMessage("Тип кожи успешно обновлён")
      setError("")
      const updatedTypes = await getAllSkinType()
      setSkinTypes(updatedTypes)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  const handleDelete = async (id: number, name: string) => {
    setSkinTypeToDeleteId(id)
    setSkinTypeToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  return (
      <div className="p-4 max-w-7xl mx-auto">
        {/* Карточка формы */}
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
          <h4 className="text-xl font-semibold text-center mb-4">
            Управление типами кожи
          </h4>

          <Button onClick={() => setOpen(true)} className="w-full">
            Добавить тип кожи
          </Button>

          {/* Модальное окно */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Добавить тип кожи</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddSkinType} className="space-y-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-3">
                    <label
                        htmlFor="formSkinTypeName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Тип кожи (RU)
                    </label>
                    <Input
                        id="formSkinTypeName"
                        placeholder="Введите тип кожи"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                        htmlFor="formSkinTypeNameEN"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Тип кожи (EN)
                    </label>
                    <Input
                        id="formSkinTypeNameEN"
                        placeholder="Введите тип кожи"
                        value={nameEN}
                        onChange={(e) => setNameEN(e.target.value)}
                        required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                        htmlFor="formSkinTypeNameKR"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Тип кожи (KR)
                    </label>
                    <Input
                        id="formSkinTypeNameKR"
                        placeholder="Введите тип кожи"
                        value={nameKR}
                        onChange={(e) => setNameKR(e.target.value)}
                        required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">Добавить</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <div style={{paddingBottom: "10px"}}></div>

          <FeedbackModal
              open={!!message || !!error}
              onOpenChange={(open) => {
                if (!open) {
                  // можно сбросить сообщения
                  setMessage(null);
                  setError(null);
                }
              }}
              message={message}
              error={error}
          />

          {/* Поиск и заголовок на одной строке */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h5 className="font-medium text-lg">Список типов кожи</h5>
            <div className="w-full md:w-64">
              <Input
                  type="text"
                  placeholder="Поиск по типам кожи..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Таблица типов кожи */}
          {loading ? (
              <p>Загрузка данных...</p>
          ) : filteredSkinTypes.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                Нет доступных типов кожи
              </div>
          ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тип кожи (RU)</TableHead>
                        <TableHead>Тип кожи (EN)</TableHead>
                        <TableHead>Тип кожи (KR)</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((type) => (
                          <TableRow key={type.id}>
                            <TableCell>{type.name}</TableCell>
                            <TableCell>{type.nameEN}</TableCell>
                            <TableCell>{type.nameKR}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(type)}
                                  title="Редактировать"
                              >
                                <PencilIcon />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(type.id, type.name)}
                                  title="Удалить"
                              >
                                <TrashIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Пагинация */}
                {filteredSkinTypes.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Показано {indexOfFirstItem + 1}-{" "}
                  {Math.min(indexOfLastItem, filteredSkinTypes.length)} из{" "}
                  {filteredSkinTypes.length}
                </span>
                      <nav className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                          Предыдущая
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        prev + 1,
                                        Math.ceil(filteredSkinTypes.length / itemsPerPage)
                                    )
                                )
                            }
                            disabled={indexOfLastItem >= filteredSkinTypes.length}
                        >
                          Следующая
                        </Button>
                      </nav>
                    </div>
                )}
              </>
          )}
        </div>

        {/* Модальное окно редактирования */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать тип кожи</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип кожи (RU)
                </label>
                <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип кожи (EN)
                </label>
                <Input
                    type="text"
                    value={editNameEN}
                    onChange={(e) => setEditNameEN(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип кожи (KR)
                </label>
                <Input
                    type="text"
                    value={editNameKR}
                    onChange={(e) => setEditNameKR(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveEdit}>Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Модальное окно подтверждения удаления */}
        <Dialog open={showConfirmDeleteModal} onOpenChange={setShowConfirmDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить тип кожи "{skinTypeToDeleteName}"?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Вы уверены, что хотите удалить этот тип кожи? Это действие нельзя отменить.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirmDeleteModal(false)}>
                Отмена
              </Button>
              <Button
                  variant="destructive"
                  onClick={async () => {
                    if (skinTypeToDeleteId !== null) {
                      try {
                        await deleteSkinType(skinTypeToDeleteId);
                        const updatedTypes = await getAllSkinType();
                        setSkinTypes(updatedTypes);
                        setMessage("Тип кожи успешно удалён");
                        setError(null);
                      } catch (err: any) {
                        setError(err.message || "Ошибка при удалении");
                        setMessage(null);
                      } finally {
                        setShowConfirmDeleteModal(false);
                        setSkinTypeToDeleteId(null);
                        setSkinTypeToDeleteName(null);
                      }
                    }
                  }}
              >
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default SkinTypeForm