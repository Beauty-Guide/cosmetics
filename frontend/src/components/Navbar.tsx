import { Link, useNavigate, useSearchParams } from "react-router"
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
import { User2Icon } from "lucide-react"
import { memo, useState } from "react"
import SearchDialogModal from "./SearchDialogModal"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

const AppNavbar: React.FC = () => {
  const { t, i18n } = useTranslation()
  const user = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchParams] = useSearchParams()

  const searchValue = searchParams.get("search")
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

  const handleLogin = () => {
    navigate("/login")
  }

  const handleNagivate = (path: string) => {
    navigate(path)
  }

  const handleOpenSearchModal = () => setIsOpen(true)

  return (
    <nav className="flex flex-col w-full shadow-md px-sides border-b-1">
      <div className="flex items-center justify-between py-4 max-md:py-3 flex-wrap gap-2">
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-900">
          Beauty Guide
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full p-0"
            >
              <User2Icon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel className="font-bold select-none">
              {t("my_account")} {`(${user?.name})`}
            </DropdownMenuLabel>
            {isAdmin && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{t("ADMIN")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="flex flex-col p-2 gap-2">
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin")}
                    >
                      {t("nav.cosmetic")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin/catalog")}
                    >
                      {t("nav.catalogs")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin/brand")}
                    >
                      {t("nav.brands")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin/skinType")}
                    >
                      {t("nav.skinTypes")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin/action")}
                    >
                      {t("nav.actions")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                      onClick={() => handleNagivate("/admin/ingredient")}
                    >
                      {t("nav.ingredients")}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
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
              <DropdownMenuItem onClick={handleLogin}>
                {t("login")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative flex w-full items-center justify-start mb-4 z-40">
        {searchParams.size > 0 && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">
            {searchParams.size}
          </div>
        )}
        <Input
          placeholder={t("search")}
          value={searchValue || ""}
          className={cn(
            "max-w-[550px] border-r-0",
            searchParams.size > 0 && "pl-9"
          )}
          readOnly
          onClick={handleOpenSearchModal}
        />
        <SearchDialogModal
          open={isOpen}
          setOpen={setIsOpen}
          userHistory={user?.history || []}
        />
      </div>
    </nav>
  )
}

export default memo(AppNavbar)
