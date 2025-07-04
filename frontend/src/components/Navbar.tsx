import React from "react"
import { Link } from "react-router"
import { useNavigate } from "react-router"
import { Button } from "./ui/button"

const AppNavbar: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="flex mb-4 p-4 w-full bg-gray-700">
      <span className="flex gap-4 items-center justify-between w-full">
        <Link className="text-amber-50" to="/">
          Beauty Guide
        </Link>

        <div className="flex gap-4 text-amber-50">
          {isAuthenticated && (
            <>
              <Link to="/admin">Косметика</Link>
              <Link to="/admin/catalog">Каталоги</Link>
              <Link to="/admin/brand">Бренды</Link>
              <Link to="/admin/skinType">Типы кожи</Link>
              <Link to="/admin/action">Действия</Link>
              <Link to="/admin/ingredient">Ингредиенты</Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <Button variant="outline" onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </span>
    </div>
  )
}

export default AppNavbar
