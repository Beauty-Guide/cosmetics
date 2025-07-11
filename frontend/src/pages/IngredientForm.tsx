import React, { useEffect, useState } from "react"
// API
import {
  addIngredient,
  deleteIngredient,
  getAllIngredients,
  updateIngredient,
} from "../services/adminIngredientApi"
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

interface Ingredient {
  name: string
}

interface IngredientView extends Ingredient {
  id: number
}

const IngredientForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingIngredient, setEditingIngredient] = useState<IngredientView | null>(null)
  const [editName, setEditName] = useState<string>("")
  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false)
  const [ingredientToDeleteId, setIngredientToDeleteId] = useState<number | null>(null)
  const [ingredientToDeleteName, setIngredientToDeleteName] = useState<string | null>(null)
  // Состояния формы
  const [ingredients, setIngredients] = useState<IngredientView[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  // Поиск и пагинация
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getAllIngredients()
        setIngredients(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }
    fetchIngredients()
  }, [])

  const filteredIngredients = ingredients.filter((i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem)

  const handleAddIngredient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Введите название ингредиента")
      return
    }
    try {
      await addIngredient({ name })
      setMessage("Ингредиент успешно добавлен!")
      setError("")
      setName("")
      const updatedIngredients = await getAllIngredients()
      setIngredients(updatedIngredients)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage("")
    }
  }

  const handleEditClick = (ingredient: IngredientView) => {
    setEditingIngredient(ingredient)
    setEditName(ingredient.name)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingIngredient || !editName.trim()) return
    try {
      await updateIngredient(editingIngredient.id, { name: editName })
      setMessage("Ингредиент успешно обновлён")
      setError("")
      const updatedIngredients = await getAllIngredients()
      setIngredients(updatedIngredients)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  const handleDelete = async (id: number, name: string) => {
    setIngredientToDeleteId(id)
    setIngredientToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  return (
      <div className="p-4 max-w-7xl mx-auto">
        {/* Карточка формы */}
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
          <h4 className="text-xl font-semibold text-center mb-4">Управление ингредиентами</h4>
          {/* Форма добавления */}
          <form onSubmit={handleAddIngredient} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-3">
              <label htmlFor="formIngredientName" className="block text-sm font-medium text-gray-700 mb-1">
                Название ингредиента
              </label>
              <Input
                  id="formIngredientName"
                  type="text"
                  placeholder="Введите название ингредиента"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Добавить ингредиент
              </Button>
            </div>
          </form>
          {/* Сообщения */}
          <FeedbackModal message={message} error={error} onClose={() => setMessage(null)} />

          {/* Поиск и заголовок на одной строке */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h5 className="font-medium text-lg">Список ингредиентов</h5>
            <div className="w-full md:w-64">
              <Input
                  type="text"
                  placeholder="Поиск по ингредиентам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Таблица ингредиентов */}
          {loading ? (
              <p>Загрузка данных...</p>
          ) : filteredIngredients.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">
                Нет доступных ингредиентов
              </div>
          ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((ingredient) => (
                          <TableRow key={ingredient.id}>
                            <TableCell>{ingredient.name}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(ingredient)}
                                  title="Редактировать"
                              >
                                <PencilIcon />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(ingredient.id, ingredient.name)}
                                  title="Удалить"
                              > <TrashIcon />

                              </Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Пагинация */}
                {filteredIngredients.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Показано {indexOfFirstItem + 1}-{" "}
                  {Math.min(indexOfLastItem, filteredIngredients.length)} из{" "}
                  {filteredIngredients.length}
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
                                    Math.min(prev + 1, Math.ceil(filteredIngredients.length / itemsPerPage))
                                )
                            }
                            disabled={indexOfLastItem >= filteredIngredients.length}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold">Редактировать ингредиент</h5>
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
                  <Input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
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
              if (ingredientToDeleteId !== null) {
                try {
                  await deleteIngredient(ingredientToDeleteId)
                  const updatedIngredients = await getAllIngredients()
                  setIngredients(updatedIngredients)
                  setMessage("Ингредиент успешно удалён")
                  setError(null)
                } catch (err: any) {
                  setError(err.message || "Ошибка при удалении")
                  setMessage(null)
                } finally {
                  setShowConfirmDeleteModal(false)
                  setIngredientToDeleteId(null)
                  setIngredientToDeleteName(null)
                }
              }
            }}
            itemName={ingredientToDeleteName || undefined}
        />
      </div>
  )
}

export default IngredientForm