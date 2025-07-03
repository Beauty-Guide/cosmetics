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
import {addBrand, deleteBrand, getAllBrands, updateBrand} from '../services/adminBrandApi';

// Типы
// Типы
import type {Brand, BrandView} from '../model/types';
import FeedbackModal from "../components/FeedbackModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { Modal } from 'react-bootstrap';

const BrandForm: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandView[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<BrandView | null>(null);
  const [editName, setEditName] = useState<string>('');

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [brandToDeleteId, setBrandToDeleteId] = useState<number | null>(null);
  const [brandToDeleteName, setBrandToDeleteName] = useState<string | null>(null);
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

  // const handleDelete = async (id: number) => {
  //     if (!window.confirm('Вы уверены, что хотите удалить этот бренд?')) return;
  //
  //     try {
  //         const success = await deleteBrand(id);
  //         if (success) {
  //             setBrands(brands.filter((b) => b.id !== id));
  //         } else {
  //             alert('Ошибка при удалении бренда');
  //         }
  //     } catch (err: any) {
  //         if (err.status === 409) {
  //             alert('Этот бренд используется в косметике и не может быть удален.');
  //         } else {
  //             alert('Ошибка при удалении');
  //         }
  //         console.error(err);
  //     }
  // };

  const handleDelete = async (id: number, name: string) => {
    setBrandToDeleteId(id);
    setBrandToDeleteName(name);
    setShowConfirmDeleteModal(true);
  };

  const handleEditClick = (brand: BrandView) => {
    setEditingBrand(brand);
    setEditName(brand.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand || !editName.trim()) return;

    try {
      await updateBrand(editingBrand.id, { name: editName });
      setMessage('Бренд успешно обновлён');
      setError('');
      const updatedBrands = await getAllBrands();
      setBrands(updatedBrands);
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении');
      setMessage(null);
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
                    <th style={{ width: '0%' }}>Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {brands.map((brand) => (
                      <tr key={brand.id}>
                        <td>{brand.name}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditClick(brand)}
                                className="d-flex align-items-center gap-1"
                                title="Редактировать"
                            >
                              <PencilFill size={16} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(brand.id, brand.name)}
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
            <Modal.Title>Редактировать бренд</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formEditBrandName">
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
              if (brandToDeleteId !== null) {
                try {
                  await deleteBrand(brandToDeleteId);
                  const updatedBrands = await getAllBrands();
                  setBrands(updatedBrands);
                  setMessage('Бренд успешно удалён');
                  setError(null);
                } catch (err: any) {
                  setError(err.message || 'Ошибка при удалении');
                  setMessage(null);
                } finally {
                  setShowConfirmDeleteModal(false);
                  setBrandToDeleteId(null);
                  setBrandToDeleteName(null);
                }
              }
            }}
            itemName={brandToDeleteName || undefined}
        />

        {/* Модальное окно для сообщений */}
        <FeedbackModal message={message} error={error} onClose={() => {
          setMessage('');
          setError('');
        }} />
      </Container>
  );
};

export default BrandForm;