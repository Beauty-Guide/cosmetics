import React, { useEffect, useState } from "react"
// API
import {
  addCosmeticAction,
  deleteCosmeticAction,
  getAllCosmeticActions,
  updateCosmeticAction,
} from "../../services/adminCosmeticActionApi"
// Типы
import type { CosmeticActionView } from "@/model/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// Компоненты
import FeedbackModal from "@/components/admin/FeedbackModal"
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
import { PencilIcon, TrashIcon } from "@/components/modal/ActionIcons.tsx"

const ActionForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Состояния формы
  const [name, setName] = useState<string>("")
  const [nameEN, setNameEN] = useState<string>("")
  const [nameKR, setNameKR] = useState<string>("")
  const [actions, setActions] = useState<CosmeticActionView[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingAction, setEditingAction] = useState<CosmeticActionView | null>(
    null
  )
  const [editName, setEditName] = useState<string>("")
  const [editNameEN, setEditNameEN] = useState<string>("")
  const [editNameKR, setEditNameKR] = useState<string>("")
  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false)
  const [actionToDeleteId, setActionToDeleteId] = useState<number | null>(null)
  const [actionToDeleteName, setActionToDeleteName] = useState<string | null>(
    null
  )
  // Поиск и пагинация
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const [open, setOpen] = useState(false)

  // Фильтрация данных (по всем языкам)
  const filteredActions = actions.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nameEN?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nameKR?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredActions.slice(indexOfFirstItem, indexOfLastItem)

  // Загрузка данных
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await getAllCosmeticActions()
        setActions(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }
    fetchActions()
  }, [])

  // Обработчики событий
  const handleAddAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Введите название действия (RU)")
      return
    }
    if (!nameEN.trim()) {
      setError("Введите название действия (EN)")
      return
    }
    if (!nameKR.trim()) {
      setError("Введите название действия (KR)")
      return
    }
    try {
      await addCosmeticAction({ name, nameEN, nameKR })
      setMessage("Действие успешно добавлено!")
      setError(null)
      setName("")
      setNameEN("")
      setNameKR("")
      const updatedActions = await getAllCosmeticActions()
      setActions(updatedActions)
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage(null)
    }
  }

  const handleEditClick = (action: CosmeticActionView) => {
    setEditingAction(action)
    setEditName(action.name)
    setEditNameEN(action.nameEN)
    setEditNameKR(action.nameKR)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (
      !editingAction ||
      !editName.trim() ||
      !editNameEN.trim() ||
      !editNameKR.trim()
    )
      return
    try {
      await updateCosmeticAction(editingAction.id, {
        name: editName,
        nameEN: editNameEN,
        nameKR: editNameKR,
      })
      setMessage("Действие успешно обновлено")
      setError(null)
      const updatedActions = await getAllCosmeticActions()
      setActions(updatedActions)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  const handleDelete = async (id: number, name: string) => {
    setActionToDeleteId(id)
    setActionToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Карточка формы */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление действиями косметики
        </h4>

        <Button onClick={() => setOpen(true)} className="w-full">
          Добавить действие
        </Button>

        {/* Модальное окно */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Добавить действие</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddAction} className="space-y-6 py-4">
              <div className="md:col-span-3">
                <label
                  htmlFor="formActionName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Действие (RU)
                </label>
                <Input
                  id="formActionName"
                  placeholder="Введите название действия"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="formActionNameEN"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Действие (EN)
                </label>
                <Input
                  id="formActionNameEN"
                  placeholder="Введите название действия"
                  value={nameEN}
                  onChange={(e) => setNameEN(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="formActionNameKR"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Действие (KR)
                </label>
                <Input
                  id="formActionNameKR"
                  placeholder="Введите название действия"
                  value={nameKR}
                  onChange={(e) => setNameKR(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">Добавить</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div style={{ paddingBottom: "10px" }}></div>

        {/* Сообщения */}
        <FeedbackModal
          open={!!message || !!error}
          onOpenChange={(open) => {
            if (!open) {
              // можно сбросить сообщения
              setMessage(null)
              setError(null)
            }
          }}
          message={message}
          error={error}
        />

        {/* Поиск и заголовок на одной строке */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Список действий</h5>
          <div className="w-full md:w-64">
            <Input
              placeholder="Поиск по действиям..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Таблица действий */}
        {loading ? (
          <p>Загрузка данных...</p>
        ) : filteredActions.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">
            Нет доступных действий
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Действие (RU)</TableHead>
                    <TableHead>Действие (EN)</TableHead>
                    <TableHead>Действие (KR)</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>{action.name}</TableCell>
                      <TableCell>{action.nameEN}</TableCell>
                      <TableCell>{action.nameKR}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(action)}
                          title="Редактировать"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(action.id, action.name)}
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
            {filteredActions.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Показано {indexOfFirstItem + 1}-{" "}
                  {Math.min(indexOfLastItem, filteredActions.length)} из{" "}
                  {filteredActions.length}
                </span>
                <nav className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                          Math.ceil(filteredActions.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={indexOfLastItem >= filteredActions.length}
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
      {showEditModal && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать действие</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Действие (RU)
                </label>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Действие (EN)
                </label>
                <Input
                  type="text"
                  value={editNameEN}
                  onChange={(e) => setEditNameEN(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Действие (KR)
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
      )}

      {/* Модальное окно подтверждения удаления */}
      <Dialog
        open={showConfirmDeleteModal}
        onOpenChange={setShowConfirmDeleteModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить действие "{actionToDeleteName}"?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Вы уверены, что хотите удалить это действие? Это действие нельзя
              отменить.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDeleteModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (actionToDeleteId !== null) {
                  try {
                    await deleteCosmeticAction(actionToDeleteId)
                    const updatedActions = await getAllCosmeticActions()
                    setActions(updatedActions)
                    setMessage("Действие успешно удалено")
                    setError(null)
                  } catch (err: any) {
                    setError(err.message || "Ошибка при удалении")
                    setMessage(null)
                  } finally {
                    setShowConfirmDeleteModal(false)
                    setActionToDeleteId(null)
                    setActionToDeleteName(null)
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

export default ActionForm
