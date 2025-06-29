import React, {useState, useEffect} from 'react';
import {
    addCosmeticAction,
    CosmeticActionAdd,
    CosmeticActionView,
    getAllCosmeticActions,
    deleteCosmeticAction
} from '../services/adminApi';

const ActionForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [actions, setActions] = useState<CosmeticActionView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Загрузка всех действий при монтировании компонента
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

    const handleAddCosmeticAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const action: CosmeticActionAdd = {
            name: formData.get('name') as string,
        };

        try {
            await addCosmeticAction(action);
            setMessage('Действие косметики успешно добавлено!');
            setError('');

            // Обновляем список после успешного добавления
            const updatedActions = await getAllCosmeticActions();
            setActions(updatedActions);
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
            setMessage('');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить это действие?')) return;

        try {
            await deleteCosmeticAction(id); // Замените на вашу функцию API
            const updatedActions = await getAllCosmeticActions();
            setActions(updatedActions);
        } catch (err) {
            alert(err);
            console.error(err);
        }
    };

    return (
        <div>
            <h3>Добавить действие косметики</h3>
            <form onSubmit={handleAddCosmeticAction}>
                <input name="name" placeholder="Введите..." required/>
                <br/>
                <button type="submit">Добавить</button>
            </form>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <h3>Список действий косметики</h3>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : (
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {actions.length > 0 ? (
                            actions.map((action) => (
                                <tr key={action.id}>
                                    <td data-label="Название">{action.name}</td>
                                    <td data-label="Действия">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(action.id)}
                                            aria-label={`Удалить ${action.name}`}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2}>Нет данных</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActionForm;