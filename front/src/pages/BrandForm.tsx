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
import { addBrand, deleteBrand, getAllBrands } from '../services/adminBrandApi';

// Типы
import { Brand, BrandView } from '../model/types';

const BrandForm: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [brands, setBrands] = useState<BrandView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Форма добавления
    const [name, setName] = useState<string>('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getAllBrands();
                setBrands(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Введите название бренда');
            return;
        }

        try {
            await addBrand({ name });
            setMessage('Бренд успешно добавлен!');
            setError('');

            const updatedBrands = await getAllBrands();
            setBrands(updatedBrands);
            setName('');
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при добавлении');
            setMessage('');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот бренд?')) return;

        try {
            const success = await deleteBrand(id);
            if (success) {
                setBrands(brands.filter((b) => b.id !== id));
            } else {
                alert('Ошибка при удалении бренда');
            }
        } catch (err: any) {
            if (err.status === 409) {
                alert('Этот бренд используется в косметике и не может быть удален.');
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
                    Управление брендами
                </Card.Header>
                <Card.Body>
                    {/* Форма добавления */}
                    <Form onSubmit={handleAddBrand} className="mb-4">
                        <Row className="align-items-end">
                            <Form.Group as={Col} md={8} controlId="formBrandName">
                                <Form.Label>Название бренда</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название бренда"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="formBrandSubmit">
                                <Button variant="primary" type="submit" className="w-100">
                                    Добавить бренд
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>

                    {/* Сообщения */}
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Список брендов */}
                    <h5>Список брендов</h5>
                    {loading ? (
                        <p>Загрузка данных...</p>
                    ) : brands.length === 0 ? (
                        <Alert variant="info">Нет доступных брендов</Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th style={{ width: '120px' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.name}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(brand.id)}
                                            aria-label={`Удалить ${brand.name}`}
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

export default BrandForm;