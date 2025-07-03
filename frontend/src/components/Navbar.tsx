import React from "react"
import { Link } from "react-router"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { useNavigate } from "react-router"

const AppNavbar: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Beauty Guide
        </Navbar.Brand>

        <Nav className="me-auto">
          {/*<Nav.Link as={Link} to="/">Главная</Nav.Link>*/}

          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/admin/catalog">
                Каталоги
              </Nav.Link>
              <Nav.Link as={Link} to="/admin">
                Косметика
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/brand">
                Бренды
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/skinType">
                Типы кожи
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/action">
                Действия
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/ingredient">
                Ингредиенты
              </Nav.Link>
            </>
          )}
        </Nav>

        {isAuthenticated && (
          <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
            Выйти
          </button>
        )}
      </Container>
    </Navbar>
  )
}

export default AppNavbar
