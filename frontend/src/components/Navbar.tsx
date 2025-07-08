import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import { useTranslation } from "react-i18next"

const AppNavbar: React.FC = () => {
  const { t, i18n } = useTranslation()
  const user = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.role.includes(ROLES.ADMIN)
  const isUser = user?.role.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const { data: favorites } = useGetAllFavProducts({
    enabled: !!isAuthenticated,
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
    window.location.reload()
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
                {t("nav.cosmetic")}
              </Link>
              <Link
                to="/admin/catalog"
                className="hover:text-blue-300 transition-colors"
              >
                {t("nav.catalogs")}
              </Link>
              <Link
                to="/admin/brand"
                className="hover:text-blue-300 transition-colors"
              >
                {t("nav.brands")}
              </Link>
              <Link
                to="/admin/skinType"
                className="hover:text-blue-300 transition-colors"
              >
                {t("nav.skinTypes")}
              </Link>
              <Link
                to="/admin/action"
                className="hover:text-blue-300 transition-colors"
              >
                {t("nav.actions")}
              </Link>
              <Link
                to="/admin/ingredient"
                className="hover:text-blue-300 transition-colors"
              >
                {t("nav.ingredients")}
              </Link>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              {t("menu")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel className="font-bold select-none">
              {t("my_account")} {isAdmin && "(ADMIN)"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAuthenticated && (
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNagivate("/favorites")}>
                  {t("favorites")}
                  <DropdownMenuShortcut>
                    {favorites?.length}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t("lang")}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                    EN
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage("ru")}>
                    RU
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage("ko")}>
                    KO
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem onClick={handleLogout}>
                {t("logout")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Link to="/login">{t("login")}</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default AppNavbar
