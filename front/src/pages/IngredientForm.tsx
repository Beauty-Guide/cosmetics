import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

// API
import {
    addIngredient,
    deleteIngredient,
    getAllIngredients,
} from '../services/adminIngredientApi';

// Типы
interface Ingredient {
    name: string;
}

interface IngredientView extends Ingredient {
    id: number;
}

const IngredientForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [ingredients, setIngredients] = useState<IngredientView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>('');

    // Загрузка всех ингредиентов при монтировании компонента
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

            const updatedIngredients = await getAllIngredients();
            setIngredients(updatedIngredients);
            setName('');
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при добавлении');
            setMessage('');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот ингредиент?')) return;

        try {
            const success = await deleteIngredient(id);
            if (success) {
                setIngredients(ingredients.filter((i) => i.id !== id));
            } else {
                alert('Ошибка при удалении ингредиента');
            }
        } catch (err: any) {
            if (err.status === 409) {
                alert('Этот ингредиент используется в косметике и не может быть удален.');
            } else {
                alert('Ошибка при удалении');
            }
            console.error(err);
        }
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
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

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
                                <th style={{ width: '120px' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ingredients.map((ingredient) => (
                                <tr key={ingredient.id}>
                                    <td>{ingredient.name}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(ingredient.id)}
                                            aria-label={`Удалить ${ingredient.name}`}
                                            className="w-100"
                                        >
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default IngredientForm;