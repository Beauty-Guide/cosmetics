import React, { useEffect, useState } from "react"
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
  addSkinType,
  deleteSkinType,
  getAllSkinType,
} from "../services/adminSkinTypeApi"

// Типы
import type { SkinType, SkinTypeView } from "../model/types"

const SkinTypeForm: React.FC = () => {
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Форма добавления
  const [name, setName] = useState<string>("")

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const data = await getAllSkinType()
        setSkinTypes(data)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных")
      } finally {
        setLoading(false)
      }
    }

    fetchSkinTypes()
  }, [])

  const handleAddSkinType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите тип кожи")
      return
    }

    try {
      await addSkinType({ name })
      setMessage("Тип кожи успешно добавлен!")
      setError("")

      const updatedTypes = await getAllSkinType()
      setSkinTypes(updatedTypes)
      setName("")
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при добавлении")
      setMessage("")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот тип кожи?")) return

    try {
      await deleteSkinType(id)
      setSkinTypes(skinTypes.filter((type) => type.id !== id))
    } catch (err) {
      alert("Ошибка при удалении")
      console.error(err)
    }
  }

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

          {/* Сообщения */}
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

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
                  <th style={{ width: "120px" }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {skinTypes.map((type) => (
                  <tr key={type.id}>
                    <td>{type.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(type.id)}
                        aria-label={`Удалить ${type.name}`}
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

export default SkinTypeForm
