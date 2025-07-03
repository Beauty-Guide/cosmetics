import React, {useEffect, useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import {PencilFill, TrashFill} from 'react-bootstrap-icons';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import FeedbackModal from '../components/FeedbackModal';

// Импортируем методы получения данных
import {getAllBrands} from '../services/adminBrandApi';
import {getAllCatalogs} from '../services/adminCatalogApi';
import {getAllCosmeticActions} from '../services/adminCosmeticActionApi';
import {getAllSkinType} from '../services/adminSkinTypeApi';
import {getAllIngredients} from '../services/adminIngredientApi';
import {addCosmetic, getAllCosmetics,} from '../services/adminCosmeticApi';
import {uploadCosmeticImages} from "../services/fileApi";

// Типы
import type {
  BrandView,
  Catalog,
  Catalog1,
  Cosmetic,
  CosmeticActionView,
  CosmeticResponse,
  IngredientView,
  SkinTypeView,
} from '../model/types';
import Alert from "react-bootstrap/Alert";
import {Carousel} from "react-bootstrap";


const CosmeticForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const [cosmetics, setCosmetics] = useState<CosmeticResponse[]>([]);
  const [loadingCosmetics, setLoadingCosmetics] = useState<boolean>(true);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [cosmeticToDeleteId, setCosmeticToDeleteId] = useState<number | null>(null);
  const [cosmeticToDeleteName, setCosmeticToDeleteName] = useState<string | null>(null);

  // Для поиска
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Для пагинации
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 300;

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

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  // Загрузка всех справочников
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandData, catalogData, actionData, skinTypeData, ingredientData, cosmeticData] = await Promise.all([
          getAllBrands(),
          getAllCatalogs(),
          getAllCosmeticActions(),
          getAllSkinType(),
          getAllIngredients(),
          getAllCosmetics(),
        ]);
        setBrands(brandData);
        setCatalogs(catalogData);
        setActions(actionData);
        setSkinTypes(skinTypeData);
        setIngredients(ingredientData);
        setCosmetics(cosmeticData)
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
        setLoadingCosmetics(false);
      }
    };

    fetchData();
  }, []);

  // // Фильтрация по названию
  // const filteredCosmetics = cosmetics.filter((cosmetic) =>
  //     cosmetic.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredCosmetics = cosmetics.filter(cosmetic =>
      [
        cosmetic.name,
        cosmetic.catalog?.name,
        cosmetic.brand?.name,
        ...cosmetic.actions.map(a => a.name),
        ...cosmetic.skinTypes.map(s => s.name),
        ...cosmetic.ingredients.map(i => i.name)
      ].some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );


// Вычисление текущих элементов для отображения
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCosmetics.slice(indexOfFirstItem, indexOfLastItem);

// Общее количество страниц
//     const totalPages = Math.ceil(filteredCosmetics.length / itemsPerPage);

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

  const handleDelete = async (id: number, name: string) => {
    setCosmeticToDeleteId(id);
    setCosmeticToDeleteName(name);
    setShowConfirmDeleteModal(true);
  };

  const handleEditClick = (catalog: Catalog1) => {
    setEditingCatalog(catalog);
    setEditName(catalog.name);
    setEditParentId(catalog.parent?.id || null); // Если есть родитель — берем его ID
    setShowEditModal(true); // Показываем модальное окно
  };


  return (
      <Container className="mt-4">
        <Card>
          <Card.Header as="h4" className="text-center"
                       style={{ cursor: 'pointer' }}
                       onClick={() => setIsOpen1(!isOpen1)}>
            Управление косметикой
          </Card.Header>
          <Card.Body className={"card-body1"} style={{ display: isOpen1 ? 'block' : 'none' }}>
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

              <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="formDescription">
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
              </Row>

              <Row className="mb-3">
                {/*<Form.Group as={Col} controlId="formCatalog">*/}
                {/*    <Form.Label>Каталог</Form.Label>*/}
                {/*    <Form.Select*/}
                {/*        disabled={loading.catalogs}*/}
                {/*        value={catalogId}*/}
                {/*        onChange={(e) =>*/}
                {/*            setCatalogId(Number(e.target.value) || '')*/}
                {/*        }*/}
                {/*        required*/}
                {/*    >*/}
                {/*        <option value="">-- Выберите каталог --</option>*/}
                {/*        {loading.catalogs ? (*/}
                {/*            <option disabled>Загрузка...</option>*/}
                {/*        ) : (*/}
                {/*            catalogs.map((catalog) => (*/}
                {/*                <option key={catalog.id} value={catalog.id}>*/}
                {/*                    {catalog.name}*/}
                {/*                </option>*/}
                {/*            ))*/}
                {/*        )}*/}
                {/*    </Form.Select>*/}
                {/*</Form.Group>*/}

                <Form.Group as={Col} controlId="formCompatibility">
                  <Form.Label>Совместимость</Form.Label>
                  <Form.Control
                      type="textarea"
                      value={compatibility}
                      onChange={(e) => setCompatibility(e.target.value)}
                      as="textarea"
                      rows={3}
                      placeholder="Пример: Подходит для всех типов кожи"
                      required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formUsage">
                  <Form.Label>Рекомендации по применению</Form.Label>
                  <Form.Control
                      type="textarea"
                      value={usageRecommendations}
                      onChange={(e) => setUsageRecommendations(e.target.value)}                                    as="textarea"
                      rows={3}
                      placeholder="Как использовать средство"
                      required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">

                <Form.Group as={Col} controlId="formApplication">
                  <Form.Label>Способ применения</Form.Label>
                  <Form.Control
                      type="textarea"
                      value={applicationMethod}
                      onChange={(e) => setApplicationMethod(e.target.value)}                                   as="textarea"
                      rows={3}
                      placeholder="Пример: Нанести утром и вечером"
                      required
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formImages">
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
              </Row>

              {/* Поле для загрузки изображений */}


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
        <div style={{paddingBottom : "10px"}}></div>
        <Card>
          <Card.Header as="h4" className="text-center"
                       style={{ cursor: 'pointer' }}
                       onClick={() => setIsOpen2(!isOpen2)}>
            Список косметики
          </Card.Header>
          <Card.Body className={"card-body2"} style={{ display: isOpen2 ? 'block' : 'none' }}>
            <FeedbackModal message={message} error={error} onClose={() => {
              setMessage(null);
              setError(null);
            }}/>
            <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
              {/* Поле поиска */}
              <Form.Group className="flex-grow-1 mb-0">
                <Form.Control
                    type="text"
                    placeholder="Поиск по названию косметики..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Сброс на первую страницу при новом поиске
                    }}
                />
              </Form.Group>

              {/*/!* Выбор количества записей на странице *!/*/}
              {/*<Form.Group className="mb-0" controlId="formPageSize">*/}
              {/*    <Form.Label className="me-2 mb-0">Записей на странице</Form.Label>*/}
              {/*    <Form.Select*/}
              {/*        value={itemsPerPage}*/}
              {/*        onChange={(e) => {*/}
              {/*            const newLimit = parseInt(e.target.value);*/}
              {/*            setItemsPerPage(newLimit); // Убедитесь, что вы обновляете состояние*/}
              {/*            setCurrentPage(1);*/}
              {/*        }}*/}
              {/*    >*/}
              {/*        <option value={10}>10</option>*/}
              {/*        <option value={20}>20</option>*/}
              {/*        <option value={50}>50</option>*/}
              {/*    </Form.Select>*/}
              {/*</Form.Group>*/}
            </div>
            {/* Список косметики */}
            <h5 className="mt-4">Список косметики</h5>
            {loadingCosmetics ? (
                <p>Загрузка косметики...</p>
            ) : cosmetics.length === 0 ? (
                <Alert variant="info">Нет доступной косметики</Alert>
            ) : (

                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                  <tr>
                    <th>Название</th>
                    <th>Бренд</th>
                    <th>Каталог</th>
                    <th>Совместимость</th>
                    <th>Рекомендации по применению</th>
                    <th>Способ применения</th>
                    <th>Действия</th>
                    <th>Тип кожи</th>
                    <th>Изо</th>
                    <th style={{width: '0%'}}>Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentItems.length > 0 ? (
                      currentItems.map((cosmetic) => (
                          <tr key={cosmetic.id}>
                            <td>{cosmetic.name}</td>
                            <td>{cosmetic.brand?.name || '—'}</td>
                            <td>{cosmetic.catalog?.name || '—'}</td>
                            <td>{cosmetic.compatibility || '—'}</td>
                            <td>{cosmetic.usageRecommendations || '—'}</td>
                            <td>{cosmetic.applicationMethod || '—'}</td>
                            <td>{cosmetic.actions.map(a => a.name).join('\n') || '—'}</td>
                            <td>{cosmetic.skinTypes.map(s => s.name).join('\n') || '—'}</td>
                            <td>
                              <div style={{ width: '200px', height: '150px' }}>
                                <Carousel variant="dark" interval={null} slide={true}>
                                  <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={`http://localhost:8080/api/files?cosmeticId=${cosmetic.id}&fileName=0`}
                                        alt="Первое изображение"
                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                    />
                                  </Carousel.Item>
                                  <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={`http://localhost:8080/api/files?cosmeticId=${cosmetic.id}&fileName=1`}
                                        alt="Второе изображение"
                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                    />
                                  </Carousel.Item>
                                  <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={`http://localhost:8080/api/files?cosmeticId=${cosmetic.id}&fileName=2`}
                                        alt="Третье изображение"
                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                    />
                                  </Carousel.Item>
                                </Carousel>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEditClick(cosmetic)}
                                    className="d-flex align-items-center gap-1"
                                    title="Редактировать"
                                >
                                  <PencilFill size={16}/>
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(cosmetic.id, cosmetic.name)}
                                    className="d-flex align-items-center gap-1"
                                    title="Удалить"
                                >
                                  <TrashFill size={16}/>
                                </Button>
                              </div>
                            </td>

                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan={9} className="text-center">
                          Нет совпадений
                        </td>
                      </tr>
                  )}
                  </tbody>
                </Table>
            )}
            {/*/!* Пагинация *!/*/}
            {/*{totalPages > 1 && (*/}
            {/*    <div className="d-flex justify-content-center mt-3">*/}
            {/*        <Button*/}
            {/*            variant="secondary"*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}*/}
            {/*            disabled={currentPage === 1}*/}
            {/*        >*/}
            {/*            Назад*/}
            {/*        </Button>*/}
            {/*        <div className="mx-3">*/}
            {/*            Страница {currentPage} из {totalPages}*/}
            {/*        </div>*/}
            {/*        <Button*/}
            {/*            variant="secondary"*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}*/}
            {/*            disabled={currentPage === totalPages}*/}
            {/*        >*/}
            {/*            Вперед*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}
            <ConfirmDeleteModal
                show={showConfirmDeleteModal}
                onHide={() => setShowConfirmDeleteModal(false)}
                onConfirm={async () => {
                  if (cosmeticToDeleteId !== null) {
                    try {
                      await deleteCosmetic(cosmeticToDeleteId);
                      setCosmetics(cosmetics.filter(c => c.id !== cosmeticToDeleteId));
                      setMessage('Косметика успешно удалена');
                      setError(null);
                    } catch (err: any) {
                      setError(err.message || 'Ошибка при удалении');
                      setMessage(null);
                    } finally {
                      setShowConfirmDeleteModal(false);
                      setCosmeticToDeleteId(null);
                      setCosmeticToDeleteName(null);
                    }
                  }
                }}
                itemName={cosmeticToDeleteName || undefined}
            />
          </Card.Body>
        </Card>
      </Container>
  );
};

export default CosmeticForm;