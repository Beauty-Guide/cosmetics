import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import FeedbackModal from '../components/FeedbackModal';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';
// API
import {addSkinType, deleteSkinType, getAllSkinType, updateSkinType} from '../services/adminSkinTypeApi';

// Типы
// Типы
import type {SkinTypeView} from '../model/types';

const SkinTypeForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingSkinType, setEditingSkinType] = useState<SkinTypeView | null>(null);
  const [editName, setEditName] = useState<string>('');
// Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [skinTypeToDeleteId, setSkinTypeToDeleteId] = useState<number | null>(null);
  const [skinTypeToDeleteName, setSkinTypeToDeleteName] = useState<string | null>(null);
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Форма добавления
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const data = await getAllSkinType();
        setSkinTypes(data);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchSkinTypes();
  }, []);

  const handleAddSkinType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Введите тип кожи');
      return;
    }

    try {
      await addSkinType({name});
      setMessage('Тип кожи успешно добавлен!');
      setError('');

      const updatedTypes = await getAllSkinType();
      setSkinTypes(updatedTypes);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при добавлении');
      setMessage('');
    }
  };

  const handleEditClick = (type: SkinTypeView) => {
    setEditingSkinType(type);
    setEditName(type.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSkinType || !editName.trim()) return;

    try {
      await updateSkinType(editingSkinType.id, { name: editName });
      setMessage('Тип кожи успешно обновлён');
      setError('');
      const updatedTypes = await getAllSkinType();
      setSkinTypes(updatedTypes);
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setSkinTypeToDeleteId(id);
    setSkinTypeToDeleteName(name);
    setShowConfirmDeleteModal(true);
  };

  return (
      <Container className="mt-4">
        <Card>
          <Card.Header as="h4" className="text-center">
            Управление типами кожи
          </Card.Header>
          <Card.Body>
            {/* Форма добавления */}
            <Form onSubmit={handleAddSkinType} className="mb-4">
              <Row className="align-items-end">
                <Form.Group as={Col} md={8} controlId="formSkinTypeName">
                  <Form.Label>Название типа кожи</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Введите тип кожи"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                  />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="formSubmit">
                  <Button variant="primary" type="submit" className="w-100">
                    Добавить тип кожи
                  </Button>
                </Form.Group>
              </Row>
            </Form>

            {/* Список типов кожи */}
            <h5>Список типов кожи</h5>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : skinTypes.length === 0 ? (
                <Alert variant="info">Нет доступных типов кожи</Alert>
            ) : (
                <Table striped bordered hover responsive>
                  <thead>
                  <tr>
                    <th>Название</th>
                    <th style={{width: '0%'}}>Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {skinTypes.map((type) => (
                      <tr key={type.id}>
                        <td>{type.name}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditClick(type)}
                                className="d-flex align-items-center gap-1"
                                title="Редактировать"
                            >
                              <PencilFill size={16} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(type.id, type.name)}
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
            <Modal.Title>Редактировать тип кожи</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formEditSkinTypeName">
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
              if (skinTypeToDeleteId !== null) {
                try {
                  await deleteSkinType(skinTypeToDeleteId);
                  const updatedTypes = await getAllSkinType();
                  setSkinTypes(updatedTypes);
                  setMessage('Тип кожи успешно удалён');
                  setError(null);
                } catch (err: any) {
                  setError(err.message || 'Ошибка при удалении');
                  setMessage(null);
                } finally {
                  setShowConfirmDeleteModal(false);
                  setSkinTypeToDeleteId(null);
                  setSkinTypeToDeleteName(null);
                }
              }
            }}
            itemName={skinTypeToDeleteName || undefined}
        />

        {/* Модальное окно для сообщений */}
        <FeedbackModal message={message} error={error} onClose={() => {
          setMessage('');
          setError('');
        }} />
      </Container>
  );
};

export default SkinTypeForm;