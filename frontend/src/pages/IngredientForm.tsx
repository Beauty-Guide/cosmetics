import React, { useEffect, useState } from 'react';
// API
import {
    addIngredient,
    deleteIngredient,
    getAllIngredients,
    updateIngredient,
} from '../services/adminIngredientApi';
// Компоненты
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import FeedbackModal from '../components/FeedbackModal';

interface Ingredient {
    name: string;
}
interface IngredientView extends Ingredient {
    id: number;
}

const IngredientForm: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Редактирование
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editingIngredient, setEditingIngredient] = useState<IngredientView | null>(null);
    const [editName, setEditName] = useState<string>('');

    // Удаление
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
    const [ingredientToDeleteId, setIngredientToDeleteId] = useState<number | null>(null);
    const [ingredientToDeleteName, setIngredientToDeleteName] = useState<string | null>(null);

    const [ingredients, setIngredients] = useState<IngredientView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Форма добавления
    const [name, setName] = useState<string>('');

    // Пагинация и поиск
    const [filteredIngredients, setFilteredIngredients] = useState<IngredientView[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const data = await getAllIngredients();
                setIngredients(data);
                setFilteredIngredients(data); // Изначально отфильтрованные данные совпадают с исходными
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    // Логика поиска
    useEffect(() => {
        const filtered = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredIngredients(filtered);
        setCurrentPage(1); // Сброс страницы при изменении поискового запроса
    }, [searchQuery, ingredients]);

    // Логика пагинации
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

    // Обработчики событий
    const handleAddIngredient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Введите название ингредиента');
            return;
        }

        try {
            await addIngredient({ name });
            setMessage('Ингредиент успешно добавлен!');
            setError('');

            const updatedIngredients = await getAllIngredients();
            setIngredients(updatedIngredients);
            setName('');
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при добавлении');
            setMessage('');
        }
    };

    const handleEditClick = (ingredient: IngredientView) => {
        setEditingIngredient(ingredient);
        setEditName(ingredient.name);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editingIngredient || !editName.trim()) return;

        try {
            await updateIngredient(editingIngredient.id, { name: editName });
            setMessage('Ингредиент успешно обновлён');
            setError('');

            const updatedIngredients = await getAllIngredients();
            setIngredients(updatedIngredients);
            setShowEditModal(false);
        } catch (err: any) {
            setError(err.message || 'Ошибка при обновлении');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        setIngredientToDeleteId(id);
        setIngredientToDeleteName(name);
        setShowConfirmDeleteModal(true);
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Card */}
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6">
                <h4 className="text-xl font-semibold text-center mb-4">Управление ингредиентами</h4>

                {/* Форма добавления */}
                <form onSubmit={handleAddIngredient} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-3">
                        <label htmlFor="formIngredientName" className="block text-sm font-medium text-gray-700 mb-1">
                            Название ингредиента
                        </label>
                        <input
                            id="formIngredientName"
                            type="text"
                            placeholder="Введите название ингредиента"
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
                            Добавить ингредиент
                        </button>
                    </div>
                </form>

                {/* Сообщения */}
                <FeedbackModal message={message} error={error} onClose={() => setMessage(null)} />

                {/* Список ингредиентов */}

                {/* Поиск и заголовок */}
                <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-lg">Список ингредиентов</h5>
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <input
                                type="text"
                                placeholder="Поиск по ингредиентам..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                {loading ? (
                    <p>Загрузка данных...</p>
                ) : filteredIngredients.length === 0 ? (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">Нет доступных ингредиентов</div>
                ) : (
                    <>
                        {/* Таблица */}
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Название</th>
                                    <th className="border border-gray-300 px-4 py-2 text-right">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map((ingredient) => (
                                    <tr key={ingredient.id}>
                                        <td className="border border-gray-300 px-4 py-2">{ingredient.name}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(ingredient)}
                                                    title="Редактировать"
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ingredient.id, ingredient.name)}
                                                    title="Удалить"
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                        <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredIngredients.length)} из {filteredIngredients.length}
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
                                    disabled={indexOfLastItem >= filteredIngredients.length}
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
                            <h5 className="text-lg font-semibold">Редактировать ингредиент</h5>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-800">
                                &times;
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
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
                    if (ingredientToDeleteId !== null) {
                        try {
                            await deleteIngredient(ingredientToDeleteId);
                            const updatedIngredients = await getAllIngredients();
                            setIngredients(updatedIngredients);
                            setMessage('Ингредиент успешно удалён');
                            setError(null);
                        } catch (err: any) {
                            setError(err.message || 'Ошибка при удалении');
                            setMessage(null);
                        } finally {
                            setShowConfirmDeleteModal(false);
                            setIngredientToDeleteId(null);
                            setIngredientToDeleteName(null);
                        }
                    }
                }}
                itemName={ingredientToDeleteName || undefined}
            />
        </div>
    );
};

export default IngredientForm;