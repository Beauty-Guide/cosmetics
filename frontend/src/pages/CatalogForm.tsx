import React, {JSX, useEffect, useState} from 'react';

import {addCatalog, getAllCatalogs,} from '../services/adminCatalogApi';
import {Catalog} from '../model/types';
import CatalogTree from "../components/CatalogTree";

const AddCatalogForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [parentId, setParentId] = useState<number | null>(null);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Загружаем список всех каталогов один раз
    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                const data = await getAllCatalogs(); // Получаем плоский список
                const treeData = buildCatalogTree(data); // Преобразуем в дерево
                setCatalogs(treeData);
            } catch (err: any) {
                setError(err.message || 'Не удалось загрузить каталоги');
            }
        };

        loadCatalogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addCatalog({name, parentId});
            setMessage('Каталог успешно добавлен!');
            setError('');
            setName('');
            setParentId(null);

            // Обновляем список каталогов после добавления
            const updatedCatalogs = await getAllCatalogs();
            setCatalogs(updatedCatalogs);

        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
            setMessage('');
        }
    };

    // Рекурсивный рендер для <select>
    const renderCatalogOptions = (catalogs: Catalog[], level = 0): JSX.Element[] => {
        const prefix = '— '.repeat(level);

        return catalogs.reduce<JSX.Element[]>((acc, catalog) => {
            acc.push(
                <option key={catalog.id} value={catalog.id}>
                    {prefix + catalog.name}
                </option>
            );

            if (catalog.children?.length) {
                acc.push(...renderCatalogOptions(catalog.children, level + 1));
            }

            return acc;
        }, []);
    };

    // Рекурсивный рендер дерева <ul><li>
    const renderCatalogTree = (catalogs: Catalog[]): JSX.Element => {
        return (
            <ul>
                {catalogs.map((catalog) => (
                    <li key={catalog.id}>
                        {catalog.name}
                        {catalog.children && catalog.children.length > 0 &&
                            renderCatalogTree(catalog.children)
                        }
                    </li>
                ))}
            </ul>
        );
    };


    return (
        <div>
            <h3>Добавить каталог</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Название:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Родительский каталог:
                        <select
                            value={parentId || ''}
                            onChange={(e) =>
                                setParentId(e.target.value ? Number(e.target.value) : null)
                            }
                        >
                            <option value="">-- Без родителя --</option>
                            {renderCatalogOptions(catalogs)}
                        </select>
                    </label>
                </div>

                <button type="submit">Сохранить</button>
            </form>

            {/* Отображение структуры каталогов */}
            <div style={{marginTop: '2rem'}}>
                <h4>Текущая структура каталогов:</h4>
                {catalogs.length > 0 ? (
                    renderCatalogTree(catalogs)
                ) : (
                    <p>Каталоги не найдены</p>
                )}
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <CatalogTree/>
        </div>
    );
};

export const buildCatalogTree = (catalogs: Catalog[]): Catalog[] => {
    const map = new Map<number, Catalog>();
    const roots: Catalog[] = [];

    // Сначала добавляем все элементы в карту по id
    catalogs.forEach(catalog => {
        map.set(catalog.id!, {...catalog, children: []});
    });

    // Затем распределяем по родителям
    catalogs.forEach(catalog => {
        const current = map.get(catalog.id!);
        if (!current) return;

        if (catalog.parentId && map.has(catalog.parentId)) {
            const parent = map.get(catalog.parentId)!;
            parent.children!.push(current);
        } else if (!catalog.parentId) {
            roots.push(current);
        }
    });

    return roots;
};
export default AddCatalogForm;