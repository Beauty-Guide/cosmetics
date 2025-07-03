import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

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

// Иконки
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

// Типы
interface Ingredient {
    name: string;
}

interface IngredientView extends Ingredient {
    id: number;
}

const IngredientForm: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<IngredientView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Форма добавления
    const [name, setName] = useState<string>('');

    // Редактирование
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editingIngredient, setEditingIngredient] = useState<IngredientView | null>(null);
    const [editName, setEditName] = useState<string>('');

    // Удаление
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
    const [ingredientToDeleteId, setIngredientToDeleteId] = useState<number | null>(null);
    const [ingredientToDeleteName, setIngredientToDeleteName] = useState<string | null>(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const data = await getAllIngredients();
                setIngredients(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

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
            setName('');

            const updatedIngredients = await getAllIngredients();
            setIngredients(updatedIngredients);
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
            setError(null);

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

    const handleCloseModal = () => {
        setMessage(null);
        setError(null);
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h4" className="text-center">
                    Управление ингредиентами
                </Card.Header>
                <Card.Body>
                    {/* Форма добавления */}
                    <Form onSubmit={handleAddIngredient} className="mb-4">
                        <Row className="align-items-end">
                            <Form.Group as={Col} md={8} controlId="formIngredientName">
                                <Form.Label>Название ингредиента</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название ингредиента"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="formSubmit">
                                <Button variant="primary" type="submit" className="w-100">
                                    Добавить ингредиент
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>

                    {/* Сообщения */}
                    <FeedbackModal message={message} error={error} onClose={handleCloseModal} />

                    {/* Список ингредиентов */}
                    <h5>Список ингредиентов</h5>
                    {loading ? (
                        <p>Загрузка данных...</p>
                    ) : ingredients.length === 0 ? (
                        <Alert variant="info">Нет доступных ингредиентов</Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th style={{ width: '0%' }} className="text-end">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {ingredients.map((ingredient) => (
                                <tr key={ingredient.id}>
                                    <td>{ingredient.name}</td>
                                    <td>
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleEditClick(ingredient)}
                                                className="d-flex align-items-center gap-1"
                                                title="Редактировать"
                                            >
                                                <PencilFill size={16} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(ingredient.id, ingredient.name)
                                                }
                                                className="d-flex align-items-center gap-1"
                                                title="Удалить"
                                            >
                                                <TrashFill size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Модальное окно редактирования */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать ингредиент</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEditIngredientName">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>

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
        </Container>
    );
};

export default IngredientForm;