import React, { useState, useEffect } from 'react';
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
  addCosmeticAction,
  deleteCosmeticAction,
  getAllCosmeticActions,
  updateCosmeticAction,
} from '../services/adminCosmeticActionApi';

// Компоненты
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import FeedbackModal from '../components/FeedbackModal';

// Иконки
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

// Типы
import type {CosmeticActionAdd, CosmeticActionView} from '../model/types';
import { Modal } from 'react-bootstrap';

const ActionForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<CosmeticActionView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Форма добавления
  const [name, setName] = useState<string>('');

  // Редактирование
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<CosmeticActionView | null>(null);
  const [editName, setEditName] = useState<string>('');

  // Удаление
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
  const [actionToDeleteId, setActionToDeleteId] = useState<number | null>(null);
  const [actionToDeleteName, setActionToDeleteName] = useState<string | null>(null);

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

    if (!name.trim()) {
      setError('Введите название действия');
      return;
    }

    try {
      await addCosmeticAction({ name });
      setMessage('Действие косметики успешно добавлено!');
      setError('');

      const updatedActions = await getAllCosmeticActions();
      setActions(updatedActions);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при добавлении');
      setMessage('');
    }
  };

  const handleEditClick = (action: CosmeticActionView) => {
    setEditingAction(action);
    setEditName(action.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAction || !editName.trim()) return;

    try {
      await updateCosmeticAction(editingAction.id, { name: editName });
      setMessage('Действие успешно обновлено');
      setError(null);

      const updatedActions = await getAllCosmeticActions();
      setActions(updatedActions);
      setShowEditModal(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setActionToDeleteId(id);
    setActionToDeleteName(name);
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
            Управление действиями косметики
          </Card.Header>
          <Card.Body>
            {/* Форма добавления */}
            <Form onSubmit={handleAddCosmeticAction} className="mb-4">
              <Row className="align-items-end">
                <Form.Group as={Col} md={8} controlId="formActionName">
                  <Form.Label>Название действия</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Введите название действия"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                  />
                </Form.Group>

                <Form.Group as={Col} md={4} controlId="formSubmit">
                  <Button variant="primary" type="submit" className="w-100">
                    Добавить действие
                  </Button>
                </Form.Group>
              </Row>
            </Form>

            {/* Сообщения */}
            <FeedbackModal message={message} error={error} onClose={handleCloseModal} />

            {/* Список действий */}
            <h5>Список действий косметики</h5>
            {loading ? (
                <p>Загрузка данных...</p>
            ) : actions.length === 0 ? (
                <Alert variant="info">Нет доступных действий</Alert>
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
                  {actions.map((action) => (
                      <tr key={action.id}>
                        <td>{action.name}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditClick(action)}
                                className="d-flex align-items-center gap-1"
                                title="Редактировать"
                            >
                              <PencilFill size={16} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                    handleDelete(action.id, action.name)
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
            <Modal.Title>Редактировать действие</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formEditActionName">
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
              if (actionToDeleteId !== null) {
                try {
                  await deleteCosmeticAction(actionToDeleteId);
                  const updatedActions = await getAllCosmeticActions();
                  setActions(updatedActions);
                  setMessage('Действие успешно удалено');
                  setError(null);
                } catch (err: any) {
                  setError(err.message || 'Ошибка при удалении');
                  setMessage(null);
                } finally {
                  setShowConfirmDeleteModal(false);
                  setActionToDeleteId(null);
                  setActionToDeleteName(null);
                }
              }
            }}
            itemName={actionToDeleteName || undefined}
        />
      </Container>
  );
};

export default ActionForm;