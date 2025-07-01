import React, {useEffect, useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

// Импортируем методы получения данных
import {getAllBrands} from '../services/adminBrandApi';
import {getAllCatalogs} from '../services/adminCatalogApi';
import {getAllCosmeticActions} from '../services/adminCosmeticActionApi';
import {getAllSkinType} from '../services/adminSkinTypeApi';
import {getAllIngredients} from '../services/adminIngredientApi';
import {addCosmetic,} from '../services/adminCosmeticApi';
import {uploadCosmeticImages} from "../services/fileApi";

// Типы
import {
    BrandView,
    Catalog,
    CosmeticActionView,
    IngredientView,
    SkinTypeView,
} from '../model/types';




const CosmeticForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Состояния для полей формы
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [brandId, setBrandId] = useState<number | ''>('');
    const [catalogId, setCatalogId] = useState<number | ''>('');
    const [compatibility, setCompatibility] = useState<string>('');
    const [usageRecommendations, setUsageRecommendations] = useState<string>('');
    const [applicationMethod, setApplicationMethod] = useState<string>('');

    // Множественный выбор
    const [actionIds, setActionIds] = useState<number[]>([]);
    const [skinTypeIds, setSkinTypeIds] = useState<number[]>([]);
    const [keyIngredientIds, setKeyIngredientIds] = useState<number[]>([]);

    // Загрузка изображений
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Состояния загрузки справочников
    const [loading, setLoading] = useState({
        brands: true,
        catalogs: true,
        actions: true,
        skinTypes: true,
        ingredients: true,
    });

    // Списки из API
    const [brands, setBrands] = useState<BrandView[]>([]);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [actions, setActions] = useState<CosmeticActionView[]>([]);
    const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([]);
    const [ingredients, setIngredients] = useState<IngredientView[]>([]);

    // Загрузка всех справочников
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandData, catalogData, actionData, skinTypeData, ingredientData] = await Promise.all([
                    getAllBrands(),
                    getAllCatalogs(),
                    getAllCosmeticActions(),
                    getAllSkinType(),
                    getAllIngredients(),
                ]);
                setBrands(brandData);
                setCatalogs(catalogData);
                setActions(actionData);
                setSkinTypes(skinTypeData);
                setIngredients(ingredientData);
            } catch (err: any) {
                setError('Ошибка загрузки справочных данных');
                console.error(err);
            } finally {
                setLoading({
                    brands: false,
                    catalogs: false,
                    actions: false,
                    skinTypes: false,
                    ingredients: false,
                });
            }
        };

        fetchData();
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setBrandId('');
        setCatalogId('');
        setCompatibility('');
        setUsageRecommendations('');
        setApplicationMethod('');
        setActionIds([]);
        setSkinTypeIds([]);
        setKeyIngredientIds([]);
        setImageFiles([]);
    };


    const handleAddCosmetic = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!brandId || !catalogId) {
            setError('Выберите бренд и каталог');
            return;
        }

        const cosmetic: Cosmetic = {
            name,
            description,
            brandId: Number(brandId),
            catalogId: Number(catalogId),
            keyIngredientIds,
            actionIds,
            skinTypeIds,
            compatibility,
            usageRecommendations,
            applicationMethod,
            imageUrls: [],
            imageFiles, // ← здесь просто храним файлы
        };

        try {
            const response = await addCosmetic(cosmetic);
            const cosmeticId = response.id;

            // Шаг 2: загружаем изображения
            if (imageFiles.length > 0) {
                await uploadCosmeticImages(cosmeticId, imageFiles);
            }
            setMessage('Косметика успешно добавлена!');
            setError('');
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при добавлении косметики');
            setMessage('');
        }
    };

    // Обработчики множественного выбора
    const toggleArrayValue = (
        array: number[],
        setter: React.Dispatch<React.SetStateAction<number[]>>,
        value: number
    ) => {
        if (array.includes(value)) {
            setter(array.filter((id) => id !== value));
        } else {
            setter([...array, value]);
        }
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h4" className="text-center">
                    Управление косметикой
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleAddCosmetic}>
                        {/* Основные поля */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formName">
                                <Form.Label>Название</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formBrand">
                                <Form.Label>Бренд</Form.Label>
                                <Form.Select
                                    disabled={loading.brands}
                                    value={brandId}
                                    onChange={(e) => setBrandId(Number(e.target.value) || '')}
                                    required
                                >
                                    <option value="">-- Выберите бренд --</option>
                                    {loading.brands ? (
                                        <option disabled>Загрузка...</option>
                                    ) : (
                                        brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Введите описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formCatalog">
                                <Form.Label>Каталог</Form.Label>
                                <Form.Select
                                    disabled={loading.catalogs}
                                    value={catalogId}
                                    onChange={(e) =>
                                        setCatalogId(Number(e.target.value) || '')
                                    }
                                    required
                                >
                                    <option value="">-- Выберите каталог --</option>
                                    {loading.catalogs ? (
                                        <option disabled>Загрузка...</option>
                                    ) : (
                                        catalogs.map((catalog) => (
                                            <option key={catalog.id} value={catalog.id}>
                                                {catalog.name}
                                            </option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formCompatibility">
                                <Form.Label>Совместимость</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Пример: Подходит для всех типов кожи"
                                    value={compatibility}
                                    onChange={(e) => setCompatibility(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formUsage">
                                <Form.Label>Рекомендации по применению</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Как использовать средство"
                                    value={usageRecommendations}
                                    onChange={(e) => setUsageRecommendations(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formApplication">
                                <Form.Label>Способ применения</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Пример: Нанести утром и вечером"
                                    value={applicationMethod}
                                    onChange={(e) => setApplicationMethod(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        {/* Поле для загрузки изображений */}
                        <Form.Group className="mb-3" controlId="formImages">
                            <Form.Label>Изображения</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setImageFiles(Array.from(e.target.files));
                                    }
                                }}
                            />
                            <Form.Text className="text-muted">Можно выбрать несколько изображений</Form.Text>
                        </Form.Group>

                        {/* Множественный выбор */}
                        <Row className="mb-3">
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Действия</Form.Label>
                                {loading.actions ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    actions.map((action) => (
                                        <Form.Check
                                            key={action.id}
                                            type="checkbox"
                                            label={action.name}
                                            checked={actionIds.includes(action.id)}
                                            onChange={() =>
                                                toggleArrayValue(actionIds, setActionIds, action.id)
                                            }
                                        />
                                    ))
                                )}
                            </Form.Group>

                            <Form.Group as={Col} md={4}>
                                <Form.Label>Типы кожи</Form.Label>
                                {loading.skinTypes ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    skinTypes.map((type) => (
                                        <Form.Check
                                            key={type.id}
                                            type="checkbox"
                                            label={type.name}
                                            checked={skinTypeIds.includes(type.id)}
                                            onChange={() =>
                                                toggleArrayValue(skinTypeIds, setSkinTypeIds, type.id)
                                            }
                                        />
                                    ))
                                )}
                            </Form.Group>

                            <Form.Group as={Col} md={4}>
                                <Form.Label>Ингредиенты</Form.Label>
                                {loading.ingredients ? (
                                    <p>Загрузка...</p>
                                ) : (
                                    ingredients.map((ingr) => (
                                        <Form.Check
                                            key={ingr.id}
                                            type="checkbox"
                                            label={ingr.name}
                                            checked={keyIngredientIds.includes(ingr.id)}
                                            onChange={() =>
                                                toggleArrayValue(keyIngredientIds, setKeyIngredientIds, ingr.id)
                                            }
                                        />
                                    ))
                                )}
                            </Form.Group>
                        </Row>

                        {/* Сообщения */}
                        {message && <div className="alert alert-success">{message}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <Button variant="primary" type="submit" className="w-100">
                            Добавить косметику
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CosmeticForm;