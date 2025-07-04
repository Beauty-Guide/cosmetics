import React from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

const AppNavbar: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="bg-gray-900 text-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4 flex-wrap">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          Beauty Guide
        </Link>

        <div className="flex flex-wrap gap-4 items-center text-sm">
          {isAuthenticated && (
            <>
              <Link
                to="/admin"
                className="hover:text-blue-300 transition-colors"
              >
                Косметика
              </Link>
              <Link
                to="/admin/catalog"
                className="hover:text-blue-300 transition-colors"
              >
                Каталоги
              </Link>
              <Link
                to="/admin/brand"
                className="hover:text-blue-300 transition-colors"
              >
                Бренды
              </Link>
              <Link
                to="/admin/skinType"
                className="hover:text-blue-300 transition-colors"
              >
                Типы кожи
              </Link>
              <Link
                to="/admin/action"
                className="hover:text-blue-300 transition-colors"
              >
                Действия
              </Link>
              <Link
                to="/admin/ingredient"
                className="hover:text-blue-300 transition-colors"
              >
                Ингредиенты
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <Button variant="secondary" onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </div>
    </nav>
  )
}

export default AppNavbar
