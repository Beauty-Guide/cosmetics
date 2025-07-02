import React, { JSX, useEffect, useState } from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

// API
import { addCatalog, getAllCatalogs } from "../services/adminCatalogApi"

// Компоненты
import CatalogTree from "../components/CatalogTree"

// Типы
import type { Catalog, Catalog1 } from "../model/types"
import Table from "react-bootstrap/Table"
import { Modal } from "react-bootstrap"

const AddCatalogForm: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null)
  const [editName, setEditName] = useState<string>("")
  const [editParentId, setEditParentId] = useState<number | null>(null)

  // Загружаем список всех каталогов один раз
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const data = await getAllCatalogs() // Получаем плоский список
        const treeData = buildCatalogTree(data) // Преобразуем в дерево
        setCatalogs(treeData)
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить каталоги")
      }
    }

    loadCatalogs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Введите название каталога")
      return
    }

    try {
      await addCatalog({ name, parentId })
      setMessage("Каталог успешно добавлен!")
      setError("")
      setName("")
      setParentId(null)

      // Обновляем список каталогов после добавления
      const updatedCatalogs = await getAllCatalogs()
      setCatalogs(updatedCatalogs)
    } catch (err: any) {
      setError(err.message || "Произошла ошибка")
      setMessage("")
    }
  }

  // Рекурсивный рендер для <select>
  const renderCatalogOptions = (
    catalogs: Catalog[],
    level = 0
  ): JSX.Element[] => {
    const prefix = "— ".repeat(level)

    return catalogs.reduce<JSX.Element[]>((acc, catalog) => {
      acc.push(
        <option key={catalog.id} value={catalog.id}>
          {prefix + catalog.name}
        </option>
      )

      if (catalog.children?.length) {
        acc.push(...renderCatalogOptions(catalog.children, level + 1))
      }

      return acc
    }, [])
  }

  // // Рекурсивный рендер дерева <ul><li>
  // const renderCatalogTree = (catalogs: Catalog[]): JSX.Element => {
  //     return (
  //         <ul>
  //             {catalogs.map((catalog) => (
  //                 <li key={catalog.id}>
  //                     {catalog.name}
  //                     {catalog.children && catalog.children.length > 0 &&
  //                         renderCatalogTree(catalog.children)
  //                     }
  //                 </li>
  //             ))}
  //         </ul>
  //     );
  // };

  const renderCatalogTableRows = (
    catalogs: Catalog1[],
    level = 0
  ): JSX.Element[] => {
    return catalogs.reduce<JSX.Element[]>((acc, catalog) => {
      acc.push(
        <tr key={catalog.id}>
          <td style={{ paddingLeft: level * 20 }}>{catalog.name}</td>
          <td>{catalog.parent ? catalog.parent.name : "—"}</td>
          <td className="text-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEditClick(catalog)}
              className="me-2"
            >
              Редактировать
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(catalog.id)}
            >
              Удалить
            </Button>
          </td>
        </tr>
      )

      return acc
    }, [])
  }

  const handleEditClick = (catalog: Catalog1) => {
    setEditingCatalog(catalog)
    setEditName(catalog.name)
    setEditParentId(catalog.parent?.id || null)
    setShowEditModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот каталог?")) return

    try {
      const success = await deleteCatalog(id)
      if (success) {
        const updatedCatalogs = await getAllCatalogs()
        setCatalogs(buildCatalogTree(updatedCatalogs))
        setMessage("Каталог успешно удалён")
      } else {
        setError("Ошибка при удалении")
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении")
    }
  }

  const handleSaveEdit = async () => {
    if (!editingCatalog || !editName.trim()) return

    try {
      await updateCatalog(editingCatalog.id, {
        name: editName,
        parentId: editParentId,
      })
      setMessage("Каталог успешно обновлён")
      setError("")

      // Обновляем список
      const updatedCatalogs = await getAllCatalogs()
      setCatalogs(buildCatalogTree(updatedCatalogs))
      setShowEditModal(false)
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении")
    }
  }

  return (
    <Container className="mt-4">
      <Card className="catalog-card">
        <Card.Header as="h4" className="text-center catalog-header">
          Управление каталогами
        </Card.Header>
        <Card.Body>
          {/* Форма добавления */}
          <Form onSubmit={handleSubmit} className="mb-4">
            <Row className="align-items-end">
              <Form.Group as={Col} md={8} controlId="formCatalogName">
                <Form.Label>Название каталога</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите название каталога"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-control"
                />
              </Form.Group>
              {/* Родительский каталог */}
              <Form.Group as={Col} md={5} controlId="formCatalogParent">
                <Form.Label>Родительский каталог</Form.Label>
                <Form.Select
                  value={parentId || ""}
                  onChange={(e) =>
                    setParentId(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">— Без родителя —</option>
                  {renderCatalogOptions(catalogs)}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="formCatalogSubmit">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 btn-primary"
                >
                  Добавить каталог
                </Button>
              </Form.Group>
            </Row>
          </Form>

          {/* Сообщения */}
          {message && (
            <Alert variant="success" className="alert-success">
              {message}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="alert-danger">
              {error}
            </Alert>
          )}

          {/* Список каталогов */}
          <h5>Текущая структура каталогов</h5>
          {/* Отдельный компонент CatalogTree */}
          <div className="mt-4 catalog-tree">
            <CatalogTree />
          </div>

          <h5 className="mt-4">Текущая структура каталогов</h5>
          {catalogs.length > 0 ? (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Родитель</th>
                  <th style={{ width: "180px" }} className="text-end">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>{renderCatalogTableRows(catalogs)}</tbody>
            </Table>
          ) : (
            <Alert variant="info" className="mt-3">
              Каталоги не найдены
            </Alert>
          )}
          {/*<div className="catalog-tree">*/}
          {/*    {catalogs.length > 0 ? (*/}
          {/*        renderCatalogTree(catalogs)*/}
          {/*    ) : (*/}
          {/*        <p>Каталоги не найдены</p>*/}
          {/*    )}*/}
          {/*</div>*/}
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать каталог</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formEditCatalogName">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEditCatalogParent">
              <Form.Label>Родительский каталог</Form.Label>
              <Form.Select
                value={editParentId || ""}
                onChange={(e) =>
                  setEditParentId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">— Без родителя —</option>
                {renderCatalogOptions(catalogs)}
              </Form.Select>
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
    </Container>
  )
}

export const buildCatalogTree = (catalogs: Catalog[]): Catalog[] => {
  const map = new Map<number, Catalog>()
  const roots: Catalog[] = []

  // Сначала добавляем все элементы в карту по id
  catalogs.forEach((catalog) => {
    map.set(catalog.id!, { ...catalog, children: [] })
  })

  // Затем распределяем по родителям
  catalogs.forEach((catalog) => {
    const current = map.get(catalog.id!)
    if (!current) return

    if (catalog.parentId && map.has(catalog.parentId)) {
      const parent = map.get(catalog.parentId)!
      parent.children!.push(current)
    } else if (!catalog.parentId) {
      roots.push(current)
    }
  })

  return roots
}

export default AddCatalogForm
