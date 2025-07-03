// @ts-ignore
import React, { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Table from "react-bootstrap/Table"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Alert from "react-bootstrap/Alert"

// API
import {
  addCosmeticAction,
  deleteCosmeticAction,
  getAllCosmeticActions,
} from "../services/adminCosmeticActionApi"

// Типы
import type { CosmeticActionAdd, CosmeticActionView } from "../model/types"

const ActionForm: React.FC = () => {
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [actions, setActions] = useState<CosmeticActionView[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string>("")

  // Загрузка всех действий при монтировании компонента
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await getAllCosmeticActions()
        setActions(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }

    fetchActions()
  }, [])

  const handleAddCosmeticAction = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите название действия")
      return
    }

    try {
      await addCosmeticAction({ name })
      setMessage("Действие косметики успешно добавлено!")
      setError("")

      const updatedActions = await getAllCosmeticActions()
      setActions(updatedActions)
      setName("")
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage("")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить это действие?")) return

    try {
      await deleteCosmeticAction(id)
      setActions(actions.filter((action) => action.id !== id))
    } catch (err: any) {
      const errorMessage = err.message || "Ошибка при удалении"
      alert(errorMessage)
      console.error(err)
    }
  }

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
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

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
                  <th style={{ width: "120px" }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id}>
                    <td>{action.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(action.id)}
                        aria-label={`Удалить ${action.name}`}
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
  )
}

export default ActionForm
