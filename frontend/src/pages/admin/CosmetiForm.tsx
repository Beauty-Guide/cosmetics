import React, { useEffect, useState } from "react"
// API
import {
  deleteCosmetic,
  updateCosmetic,
  updateCosmeticCatalog,
  getAllCosmetics,
  getCosmeticById,
} from "../../services/adminCosmeticApi"
// Типы
import type {
  CosmeticsResponse,
  CosmeticResponse,
  Catalog1,
} from "../../model/types"
// Компоненты
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal"
import FeedbackModal from "@/components/admin/FeedbackModal"
import AddCosmeticModal from "@/components/modal/AddCosmeticModal.tsx"
import EditCosmeticModal from "@/components/modal/EditCosmeticModal.tsx"
import MoveCosmeticModal from "@/components/modal/MoveCosmeticModal.tsx"
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
import { getAllCatalogsForAddCosmetic } from "@/services/adminCatalogApi.ts"
import {
  PencilIcon,
  TransferIcon,
  TrashIcon,
} from "@/components/modal/ActionIcons.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const CosmeticForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Состояния формы
  const [cosmeticsResponse, setCosmeticsResponse] = useState<
    CosmeticsResponse[]
  >([])
  const [cosmetics, setCosmetics] = useState<CosmeticResponse[]>([])
  const [loadingCosmetics, setLoadingCosmetics] = useState<boolean>(true)
  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false)
  const [cosmeticToDeleteId, setCosmeticToDeleteId] = useState<number | null>(
    null
  )
  const [cosmeticToDeleteName, setCosmeticToDeleteName] = useState<
    string | null
  >(null)
  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingCosmetic, setEditingCosmetic] =
    useState<CosmeticResponse | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<CosmeticResponse>>(
    {}
  )
  // Поиск и пагинация
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(
    null
  )
  const [catalogs, setCatalogs] = useState<Catalog1[]>([])
  const [currentCosmetic, setCurrentCosmetic] = useState<{
    id: number
    name: string
  } | null>(null)
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cosmeticData = await getAllCosmetics()
        setCosmeticsResponse(cosmeticData)
        setCosmetics(cosmeticData.cosmetics)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
        console.error(err)
      } finally {
        setLoadingCosmetics(false)
      }
    }
    fetchData()
  }, [])

  // Фильтрация
  const filteredCosmetics = cosmetics.filter((cosmetic) =>
    [
      cosmetic.name,
      ...cosmetic.skinTypes.map((s) => s.name),
      ...cosmetic.actions.map((a) => a.name),
      ...cosmetic.ingredients.map((i) => i.name),
      cosmetic.catalog?.name,
      cosmetic.brand?.name,
    ].some(
      (value) => value && value.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleDelete = (id: number, name: string) => {
    setCosmeticToDeleteId(id)
    setCosmeticToDeleteName(name)
    setShowConfirmDeleteModal(true)
  }

  const handleEditClick = async (cosmeticId: number) => {
    try {
      const cosmetic = await getCosmeticById(cosmeticId) // Запрашиваем данные с сервера
      setEditingCosmetic(cosmetic)
      setEditFormData({ ...cosmetic }) // Копируем данные в форму
      setShowEditModal(true)
    } catch (err) {
      setError("Ошибка при загрузке данных косметики")
      console.error(err)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingCosmetic) return
    try {
      await updateCosmetic(editingCosmetic.id, editFormData as CosmeticResponse)
      setMessage("Косметика успешно обновлена")
      setError(null)
      const cosmeticData = await getAllCosmetics()
      setCosmeticsResponse(cosmeticData)
      setCosmetics(cosmeticData.cosmetics)
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
      setMessage(null)
    }
  }

  const handleAddSuccess = async () => {
    try {
      const cosmeticData = await getAllCosmetics()
      setCosmeticsResponse(cosmeticData)
      setCosmetics(cosmeticData.cosmetics)
    } catch (err) {
      console.error("Ошибка при загрузке косметики:", err)
    }
  }

  const handleMove = async (id: number, name: string) => {
    try {
      const catalogsData = await getAllCatalogsForAddCosmetic()
      setCurrentCosmetic({ id: id, name: name })
      setCatalogs(catalogsData)
      setSelectedCatalogId(null)
      setShowMoveModal(true)
    } catch (error) {
      alert("Не удалось загрузить каталоги")
      console.error(error)
    }
  }

  const handleConfirmMove = async () => {
    if (selectedCatalogIds.length > 0 && currentCosmetic) {
      const catalogId = Number(selectedCatalogIds[0])
      try {
        await updateCosmetic(currentCosmetic.id, {
          ...editingCosmetic,
          catalogId: catalogId,
        })
        setMessage("Косметика успешно перемещена")
        setError(null)
        const updatedData = await getAllCosmetics()
        setCosmeticsResponse(updatedData)
        setCosmetics(updatedData.cosmetics)
        setShowMoveModal(false)
      } catch (err: any) {
        setError(err.message || "Ошибка при перемещении косметики")
        setMessage(null)
      }
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Карточка формы добавления */}
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
        <h4 className="text-xl font-semibold text-center mb-4">
          Управление косметикой
        </h4>
        <AddCosmeticModal onAddSuccess={handleAddSuccess} />
        <div style={{ paddingBottom: "10px" }}></div>

        {/* Поиск и заголовок */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h5 className="font-medium text-lg">Список косметики</h5>
          <div className="w-full md:w-64">
            <Input
              placeholder="Поиск по косметике..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Таблица */}
        {loadingCosmetics ? (
          <p>Загрузка данных...</p>
        ) : filteredCosmetics.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            Нет доступной косметики
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Бренд</TableHead>
                    <TableHead>Каталог</TableHead>
                    <TableHead>В избранных</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((cosmetic) => (
                    <TableRow key={cosmetic.id}>
                      <TableCell>{cosmetic.name}</TableCell>
                      <TableCell>{cosmetic.brand?.name || "—"}</TableCell>
                      <TableCell>{cosmetic.catalog?.name || "—"}</TableCell>
                      <TableCell>{cosmetic.favoriteCount || "—"}</TableCell>
                      <TableCell>{cosmetic.rating || "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(cosmetic.id)}
                          title="Редактировать"
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
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(cosmetic.id, cosmetic.name)
                          }
                          title="Удалить"
                        >
                          <TrashIcon />
                        </Button>
                        {cosmetic.catalog.hasChildren && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleMove(cosmetic.id, cosmetic.name)
                            }
                            title="Перенести"
                          >
                            <TransferIcon />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Показано {indexOfFirstItem + 1}-{" "}
                  {Math.min(indexOfLastItem, filteredCosmetics.length)} из{" "}
                  {filteredCosmetics.length}
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Следующая
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Модальные окна */}
        <Dialog
          open={showConfirmDeleteModal}
          onOpenChange={setShowConfirmDeleteModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Удалить косметику "{cosmeticToDeleteName}"?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Вы уверены, что хотите удалить эту косметику? Это действие
                нельзя отменить.
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
                  if (cosmeticToDeleteId !== null) {
                    try {
                      await deleteCosmetic(cosmeticToDeleteId)
                      setMessage("Косметика успешно удалена")
                      setError(null)
                      setCosmetics((prev) =>
                        prev.filter((c) => c.id !== cosmeticToDeleteId)
                      )
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
              >
                Удалить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {editingCosmetic && (
          <EditCosmeticModal
            isOpen={showEditModal}
            onOpenChange={setShowEditModal}
            onClose={() => setShowEditModal(false)}
            onEditSuccess={async () => {
              const updatedData = await getAllCosmetics()
              setCosmeticsResponse(updatedData)
              setCosmetics(updatedData.cosmetics)
            }}
            initialData={{
              id: editingCosmetic.id,
              name: editingCosmetic.name,
              brandId: editingCosmetic.brand?.id || -1,
              catalogId: editingCosmetic.catalog?.id || -1,
              compatibility: editingCosmetic.compatibility || "",
              compatibilityEN: editingCosmetic.compatibilityEN || "",
              compatibilityKR: editingCosmetic.compatibilityKR || "",
              usageRecommendations: editingCosmetic.usageRecommendations || "",
              usageRecommendationsEN:
                editingCosmetic.usageRecommendationsEN || "",
              usageRecommendationsKR:
                editingCosmetic.usageRecommendationsKR || "",
              applicationMethod: editingCosmetic.applicationMethod || "",
              applicationMethodEN: editingCosmetic.applicationMethodEN || "",
              applicationMethodKR: editingCosmetic.applicationMethodKR || "",
              actions: editingCosmetic.actions,
              skinTypes: editingCosmetic.skinTypes,
              ingredients: editingCosmetic.ingredients,
              images: editingCosmetic.images,
              rating: editingCosmetic.rating,
              marketplaceLinks: editingCosmetic.marketplaceLinks,
            }}
          />
        )}

        <MoveCosmeticModal
          isOpen={showMoveModal}
          catalogs={catalogs}
          currentCosmeticName={currentCosmetic?.name || null}
          cosmeticId={currentCosmetic?.id || -1}
          onConfirm={async (catalogId, cosmeticId) => {
            try {
              await updateCosmeticCatalog(cosmeticId, catalogId)
              setMessage("Косметика успешно перемещена")
              setError(null)
              const updatedData = await getAllCosmetics()
              setCosmeticsResponse(updatedData)
              setCosmetics(updatedData.cosmetics)
              setShowMoveModal(false)
            } catch (err: any) {
              setError(err.message || "Ошибка при перемещении")
              setMessage(null)
            }
          }}
          onClose={() => setShowMoveModal(false)}
        />

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
      </div>
    </div>
  )
}

export default CosmeticForm
