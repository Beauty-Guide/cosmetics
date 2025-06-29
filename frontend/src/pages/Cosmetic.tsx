import React, { useState, useEffect } from 'react';
import { addCosmetic, Cosmetic, getAllCatalogs } from '../services/adminApi'; // импортируем новый метод

const CosmeticForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [catalogs, setCatalogs] = useState<{ id: number; name: string }[]>([]); // хранение каталогов
    const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(true); // загрузка каталогов

    // Загрузка каталогов с API
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const data = await getAllCatalogs(); // вызываем API
                setCatalogs(data);
            } catch (err) {
                console.error('Ошибка загрузки каталогов:', err);
                setError('Не удалось загрузить список каталогов');
            } finally {
                setLoadingCatalogs(false);
            }
        };

        fetchCatalogs();
    }, []);

    const handleAddCosmetic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const getMultipleValues = (name: string): number[] => {
            return Array.from(formData.getAll(name) as string[]).map(Number);
        };

        const cosmetic: Cosmetic = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            brandId: Number(formData.get('brandId')),
            catalogId: Number(formData.get('catalogId')),
            keyIngredientIds: getMultipleValues('keyIngredientIds'),
            actionIds: getMultipleValues('actionIds'),
            skinTypeIds: getMultipleValues('skinTypeIds'),
            compatibility: formData.get('compatibility') as string,
            usageRecommendations: formData.get('usageRecommendations') as string,
            applicationMethod: formData.get('applicationMethod') as string,
            imageUrls: [],
        };

        try {
            await addCosmetic(cosmetic);
            setMessage('Косметика успешно добавлена!');
            setError('');
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
            setMessage('');
        }
    };

    return (
        <div>
            <h3>Добавить косметику</h3>
            <form onSubmit={handleAddCosmetic}>
                <input name="name" placeholder="Название" required />
                <br />

                <textarea name="description" placeholder="Описание" required />
                <br />

                <label>
                    Бренд ID:
                    <input type="number" name="brandId" required />
                </label>
                <br />

                <label>
                    Каталог:
                    <select name="catalogId" required>
                        <option value="">-- Выберите каталог --</option>
                        {loadingCatalogs ? (
                            <option disabled>Загрузка...</option>
                        ) : error ? (
                            <option disabled>Ошибка загрузки</option>
                        ) : (
                            catalogs.map((catalog) => (
                                <option key={catalog.id} value={catalog.id}>
                                    {catalog.name}
                                </option>
                            ))
                        )}
                    </select>
                </label>
                <br />

                <label>
                    Совместимость:
                    <input name="compatibility" placeholder="Например: подходит для всех типов кожи" />
                </label>
                <br />

                <label>
                    Рекомендации по применению:
                    <input name="usageRecommendations" placeholder="Как использовать средство" />
                </label>
                <br />

                <label>
                    Способ применения:
                    <input name="applicationMethod" placeholder="Пример: нанести утром и вечером" />
                </label>
                <br />

                {/* Предполагается, что у тебя есть выпадающие списки с возможностью множественного выбора */}
                <label>
                    Действия (ID):
                    <select name="actionIds" multiple>
                        {/* Эти значения должны приходить с сервера */}
                        <option value="1">Увлажнение</option>
                        <option value="2">Питание</option>
                    </select>
                </label>
                <br />

                <label>
                    Типы кожи (ID):
                    <select name="skinTypeIds" multiple>
                        <option value="1">Жирная</option>
                        <option value="2">Сухая</option>
                    </select>
                </label>
                <br />

                <label>
                    Ключевые ингредиенты (ID):
                    <select name="keyIngredientIds" multiple>
                        <option value="1">Гиалуроновая кислота</option>
                        <option value="2">Ретинол</option>
                    </select>
                </label>
                <br />

                <button type="submit">Добавить косметику</button>
            </form>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};


export default CosmeticForm;