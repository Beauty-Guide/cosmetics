import React, { useEffect, useState } from 'react';
// API
import {
  addCosmeticAction,
  deleteCosmeticAction,
  getAllCosmeticActions,
  updateCosmeticAction,
} from '../services/adminCosmeticActionApi';

// Компоненты
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import FeedbackModal from '../components/FeedbackModal';
import type {CosmeticActionView} from "@/model/types.ts";

const ActionForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Состояния формы
  const [name, setName] = useState<string>('');
  const [actions, setActions] = useState<CosmeticActionView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<CosmeticActionView | null>(null);
  const [editName, setEditName] = useState<string>('');

  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [actionToDeleteId, setActionToDeleteId] = useState<number | null>(null);
  const [actionToDeleteName, setActionToDeleteName] = useState<string | null>(null);

  // Поиск и пагинация
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Фильтрация данных
  const filteredActions = actions.filter((a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActions.slice(indexOfFirstItem, indexOfLastItem);

  // Загрузка данных
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await getAllCosmeticActions();
        setActions(data);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  // Обработчики событий
  const handleAddAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Введите название действия');
      return;
    }

    try {
      await addCosmeticAction({ name });
      setMessage('Действие успешно добавлено!');
      setError(null);
      setName('');
      const updatedActions = await getAllCosmeticActions();
      setActions(updatedActions);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при добавлении');
      setMessage(null);
    }
  };

  const handleEditClick = (action: CosmeticActionView) => {
    setEditingAction(action);
    setEditName(action.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAction || !editName.trim()) return;

    try {
      await updateCosmeticAction(editingAction.id, { name: editName });
      setMessage('Действие успешно обновлено');
      setError(null);
      const updatedActions = await getAllCosmeticActions();
      setActions(updatedActions);
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setActionToDeleteId(id);
    setActionToDeleteName(name);
    setShowConfirmDeleteModal(true);
  };

  const handleCloseModal = () => {
    setMessage(null);
    setError(null);
  };

  return (
      <div className="p-4 max-w-5xl mx-auto">
        {/* Карточка формы */}
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
          <h4 className="text-xl font-semibold text-center mb-4">Управление действиями косметики</h4>

          {/* Форма добавления */}
          <form onSubmit={handleAddAction} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-3">
              <label htmlFor="formActionName" className="block text-sm font-medium text-gray-700 mb-1">
                Название действия
              </label>
              <input
                  id="formActionName"
                  type="text"
                  placeholder="Введите название действия"
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
                Добавить действие
              </button>
            </div>
          </form>

          {/* Сообщения */}
          <FeedbackModal message={message} error={error} onClose={handleCloseModal} />

          {/* Поиск и заголовок на одной строке */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h5 className="font-medium text-lg">Список действий</h5>
            <div className="w-full md:w-64">
              <input
                  type="text"
                  placeholder="Поиск по действиям..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Сброс на первую страницу при новом поиске
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Таблица действий */}
          {loading ? (
              <p>Загрузка данных...</p>
          ) : filteredActions.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-4">Нет доступных действий</div>
          ) : (
              <>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Название</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((action) => (
                        <tr key={action.id}>
                          <td className="border border-gray-300 px-4 py-2">{action.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                  onClick={() => handleEditClick(action)}
                                  title="Редактировать"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                  onClick={() => handleDelete(action.id, action.name)}
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
                <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredActions.length)} из{' '}
                {filteredActions.length}
              </span>
                  <nav className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                    >
                      Предыдущая
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={indexOfLastItem >= filteredActions.length}
                        className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
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
                  <h5 className="text-lg font-semibold">Редактировать действие</h5>
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-500 hover:text-gray-800 text-xl"
                  >
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
              if (actionToDeleteId !== null) {
                try {
                  await deleteCosmeticAction(actionToDeleteId);
                  const updatedActions = await getAllCosmeticActions();
                  setActions(updatedActions);
                  setMessage('Действие успешно удалено');
                  setError(null);
                } catch (err: any) {
                  setError(err.message || 'Ошибка при удалении');
                  setMessage(null);
                } finally {
                  setShowConfirmDeleteModal(false);
                  setActionToDeleteId(null);
                  setActionToDeleteName(null);
                }
              }
            }}
            itemName={actionToDeleteName || undefined}
        />
      </div>
  );
};

export default ActionForm;