import React, { useEffect, useState } from "react"
// API
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../../services/adminBrandApi"
// Типы
import type { BrandView } from "../../model/types"
// Компоненты shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PencilIcon, TrashIcon } from "@/components/modal/ActionIcons.tsx"
import FeedbackModal from "@/components/admin/FeedbackModal.tsx"

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
  const [open, setOpen] = useState(false)
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      setOpen(false)
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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Card */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление брендами
        </h4>

        {/* Кнопка открытия модального окна */}
        <Button onClick={() => setOpen(true)} className="w-full">
          Добавить бренд
        </Button>

        {/* Модальное окно */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Добавить бренд</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddBrand} className="space-y-6 py-4">
              <div className="flex-1">
                <label
                  htmlFor="formBrandName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Название бренда
                </label>
                <Input
                  id="formBrandName"
                  placeholder="Введите название бренда"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

        {/* Поиск и заголовок на одной строке */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Список брендов</h5>
          <div className="w-full md:w-64">
            <Input
              placeholder="Поиск по брендам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* Таблица через shadcn */}
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(brand)}
                        title="Редактировать"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brand.id, brand.name)}
                        title="Удалить"
                      >
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Пагинация */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredBrands.length)} из{" "}
                {filteredBrands.length}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Предыдущая
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastItem >= filteredBrands.length}
                >
                  Следующая
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

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

      {/* Модальное окно редактирования через Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать бренд</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
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
      <Dialog
        open={showConfirmDeleteModal}
        onOpenChange={setShowConfirmDeleteModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить бренд "{brandToDeleteName}"?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mt-2">
            Вы уверены, что хотите удалить этот бренд?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDeleteModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
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
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BrandForm
