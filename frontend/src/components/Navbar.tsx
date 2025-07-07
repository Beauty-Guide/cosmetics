import React from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { jwtDecode, type JwtPayload } from "jwt-decode"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AppNavbar: React.FC = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const isAuthenticated = !!token

  // Получаем роли из токена
  const userRoles = React.useMemo(() => {
    if (!token) return []
    try {
      const decoded = jwtDecode<JwtPayload & { roles: string[] }>(token)
      return decoded.roles || []
    } catch (error) {
      console.error("Ошибка декодирования токена", error)
      return []
    }
  }, [token])

  const isAdmin = userRoles.includes("ROLE_ADMIN")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleNagivate = (path: string) => {
    navigate(path)
  }

  return (
    <nav className="bg-gray-900 text-white shadow-md rounded-b-md px-sides">
      <div className="container mx-auto flex items-center justify-between py-4 flex-wrap gap-2">
        <Link to="/" className="text-xl font-bold tracking-tight text-white">
          Beauty Guide
        </Link>

        <div className="flex flex-wrap gap-5 max-md:gap-2 items-center text-sm py-2">
          {isAdmin && (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              Меню
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel className="font-bold select-none">
              Мой аккаунт
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNagivate("/favorites")}>
                Избранное
                <DropdownMenuShortcut>1</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Link to="/login">Войти</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default AppNavbar
