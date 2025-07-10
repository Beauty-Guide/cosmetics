import React, { useEffect, useState } from "react"
// API
import {deleteCosmetic, getAllCosmetics, updateCosmetic, updateCosmeticCatalog} from "../services/adminCosmeticApi"
// Типы
import type {
    CosmeticsResponse,
    CosmeticResponse, Catalog1,
} from "../model/types"
// Компоненты
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal"
import FeedbackModal from "../components/admin/FeedbackModal"
import AddCosmeticModal from "@/components/modal/AddCosmeticModal.tsx"
import EditCosmeticModal from "@/components/modal/EditCosmeticModal.tsx";
import {getAllCatalogsForAddCosmetic} from "@/services/adminCatalogApi.ts";
import MoveCosmeticModal from "@/components/modal/MoveCosmeticModal.tsx";

const CosmeticForm: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    // Состояния формы
    const [cosmeticsResponse, setCosmeticsResponse] = useState<CosmeticsResponse[]>([])
    const [cosmetics, setCosmetics] = useState<CosmeticResponse[]>([])
    const [loadingCosmetics, setLoadingCosmetics] = useState<boolean>(true)
    // Удаление
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false)
    const [cosmeticToDeleteId, setCosmeticToDeleteId] = useState<number | null>(null)
    const [cosmeticToDeleteName, setCosmeticToDeleteName] = useState<string | null>(null)
    // Редактирование
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    const [editingCosmetic, setEditingCosmetic] = useState<CosmeticResponse | null>(null)
    const [editFormData, setEditFormData] = useState<Partial<CosmeticResponse>>({})

    // Поиск и пагинация
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 10

    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
    const [catalogs, setCatalogs] = useState<Catalog1[]>([]);
    const [currentCosmetic, setCurrentCosmetic] = useState<{ id: number; name: string } | null>(null);
    const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
    // Загрузка данных
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
        ].some((value) =>
            value && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredCosmetics.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredCosmetics.length / itemsPerPage)

    // Обработчики событий
    const handleDelete = (id: number, name: string) => {
        setCosmeticToDeleteId(id)
        setCosmeticToDeleteName(name)
        setShowConfirmDeleteModal(true)
    }

    const handleEditClick = (cosmetic: CosmeticResponse) => {
        setEditingCosmetic(cosmetic)
        setEditFormData({ ...cosmetic }) // Копируем текущие данные
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        if (!editingCosmetic) return
        try {
            await updateCosmetic(editingCosmetic.id, editFormData as CosmeticResponse)
            setMessage("Косметика успешно обновлена")
            setError(null)
            // Обновляем список косметики
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
        console.log("Косметика успешно добавлена!")
        try {
            const cosmeticData = await getAllCosmetics()
            setCosmeticsResponse(cosmeticData)
            setCosmetics(cosmeticData.cosmetics)
        } catch (err) {
            console.error("Ошибка при загрузке косметики:", err)
        }
    }

    // Загрузка каталогов и открытие модалки
    const handleMove = async (id: number, name: string) => {
        try {
            const catalogsData = await getAllCatalogsForAddCosmetic();
            setCurrentCosmetic({ id: id, name: name });
            setCatalogs(catalogsData);
            setSelectedCatalogId(null);
            setShowMoveModal(true);
        } catch (error) {
            alert('Не удалось загрузить каталоги');
            console.error(error);
        }
    };

    const handleConfirmMove = async () => {
        if (selectedCatalogIds.length > 0 && currentCosmetic) {
            const catalogId = Number(selectedCatalogIds[0]);

            try {
                await updateCosmetic(currentCosmetic.id, {
                    ...editingCosmetic,
                    catalogId: catalogId
                });

                setMessage("Косметика успешно перемещена");
                setError(null);

                const updatedData = await getAllCosmetics();
                setCosmeticsResponse(updatedData);
                setCosmetics(updatedData.cosmetics);

                setShowMoveModal(false);
            } catch (err: any) {
                setError(err.message || "Ошибка при перемещении косметики");
                setMessage(null);
            }
        }
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Карточка формы добавления */}
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h4 className="text-xl font-semibold text-center mb-4">Управление косметикой</h4>
                <AddCosmeticModal onAddSuccess={handleAddSuccess}/>
            </div>

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
                                <th className="border border-gray-300 px-4 py-2 text-left">Название</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Бренд</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Каталог</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Совместимость</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Рекомендации</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Способ применения</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Тип кожи</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Рейтинг</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((cosmetic) => (
                                <tr key={cosmetic.id}>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.brand?.name || '—'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.catalog?.name || '—'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.compatibility || '—'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.usageRecommendations || '—'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.applicationMethod || '—'}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {cosmetic.skinTypes.map(s => s.name).join(', ') || '—'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{cosmetic.rating || '—'}</td>

                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCosmetic(cosmetic);
                                                    setShowEditModal(true);
                                                }}
                                                title="Редактировать"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cosmetic.id, cosmetic.name)}
                                                title="Удалить"
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            {/* Кнопка Перенести (отображается только если catalog.hasChildren) */}
                                            {cosmetic.catalog.hasChildren && (
                                                <button
                                                    onClick={() => handleMove(cosmetic.id, cosmetic.name)}
                                                    title="Перенести"
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l4-4m0 0l-4-4m4 4H8m8 4l4 4m0 0l-4 4m4-4H8" />
                                                    </svg>
                                                </button>
                                            )}
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
                                Показано {indexOfFirstItem + 1}-{" "}
                                {Math.min(indexOfLastItem, filteredCosmetics.length)} из{" "}
                                {filteredCosmetics.length}
                            </span>
                            <nav className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                                >
                                    Предыдущая
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

            {/* Модальное окно подтверждения удаления */}
            <ConfirmDeleteModal
                show={showConfirmDeleteModal}
                onHide={() => setShowConfirmDeleteModal(false)}
                onConfirm={async () => {
                    if (cosmeticToDeleteId !== null) {
                        try {
                            await deleteCosmetic(cosmeticToDeleteId)
                            setMessage("Косметика успешно удалена")
                            setError(null)
                            setCosmetics(prev => prev.filter(c => c.id !== cosmeticToDeleteId))
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

            {editingCosmetic && (
                <EditCosmeticModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onEditSuccess={async () => {
                        const updatedData = await getAllCosmetics();
                        setCosmeticsResponse(updatedData);
                        setCosmetics(updatedData.cosmetics);
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
                        usageRecommendationsEN: editingCosmetic.usageRecommendationsEN || "",
                        usageRecommendationsKR: editingCosmetic.usageRecommendationsKR || "",
                        applicationMethod: editingCosmetic.applicationMethod || "",
                        applicationMethodEN: editingCosmetic.applicationMethodEN || "",
                        applicationMethodKR: editingCosmetic.applicationMethodKR || "",
                        actions: editingCosmetic.actions,
                        skinTypes: editingCosmetic.skinTypes,
                        ingredients: editingCosmetic.ingredients,
                        images: editingCosmetic.images,
                        rating: editingCosmetic.rating,
                    }}
                />
            )}

            <MoveCosmeticModal
                isOpen={showMoveModal}
                catalogs={catalogs}
                currentCosmeticName={currentCosmetic?.name || null}
                cosmeticId={currentCosmetic?.id || -1} // ← передаем ID косметики
                onConfirm={async (catalogId, cosmeticId) => {
                    try {
                        await updateCosmeticCatalog(cosmeticId, catalogId);
                        setMessage("Косметика успешно перемещена");
                        setError(null);
                        const updatedData = await getAllCosmetics();
                        setCosmeticsResponse(updatedData);
                        setCosmetics(updatedData.cosmetics);
                        setShowMoveModal(false);
                    } catch (err: any) {
                        setError(err.message || "Ошибка при перемещении");
                        setMessage(null);
                    }
                }}
                onClose={() => setShowMoveModal(false)}
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