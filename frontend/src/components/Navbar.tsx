import { Link, useLocation, useNavigate, useSearchParams } from "react-router"
import FilterCombobox from "@/components/HomeComponents/FilterCombobox"
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
import { Search, User2Icon } from "lucide-react"
import { Input } from "./ui/input"
import { memo, useEffect, useRef, useState } from "react"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { Skeleton } from "./ui/skeleton"

const AppNavbar: React.FC = () => {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const user = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchValue = searchParams.get("search")
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )

  const isAdmin = user?.role.includes(ROLES.ADMIN)
  const isUser = user?.role.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const { data: favorites } = useGetAllFavProducts({
    enabled: !!isAuthenticated,
  })
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
  }, [pathname, searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    selectedBrands.forEach((b) => {
      params.append("brand", b)
    })

    setSearchParams(params, { replace: false })
  }, [selectedBrands, setSearchParams])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
    window.location.reload()
  }

  const handleNagivate = (path: string) => {
    navigate(path)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams()
    const searchValue = searchInputRef.current?.value.trim()

    if (searchValue && searchValue.length > 2) {
      params.append("search", searchValue)
    } else if (!searchValue) {
      params.delete("search")
    }

    setSearchParams(params, { replace: false })
  }

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
              {t("my_account")} {isAdmin && "(ADMIN)"}
            </DropdownMenuLabel>
            {isAdmin && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{t("ADMIN")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="flex flex-col p-2 gap-2">
                    <Link
                      to="/admin"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.cosmetic")}
                    </Link>
                    <Link
                      to="/admin/catalog"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.catalogs")}
                    </Link>
                    <Link
                      to="/admin/brand"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.brands")}
                    </Link>
                    <Link
                      to="/admin/skinType"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.skinTypes")}
                    </Link>
                    <Link
                      to="/admin/action"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.actions")}
                    </Link>
                    <Link
                      to="/admin/ingredient"
                      className="text-black hover:text-blue-900 transition-colors"
                    >
                      {t("nav.ingredients")}
                    </Link>
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
              <DropdownMenuItem>
                <Link to="/login">{t("login")}</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center justify-start gap-2 mb-4"
      >
        {!isLoadingBrands ? (
          <FilterCombobox
            label={t("filter.brand")}
            options={brands}
            values={selectedBrands}
            onChange={setSelectedBrands}
            labels={false}
            badges={false}
            className="max-w-[50px]"
          />
        ) : (
          <Skeleton className="h-[35px] w-[45px] rounded-md" />
        )}
        <Input
          type="search"
          placeholder={t("search")}
          className="max-w-[550px]"
          defaultValue={searchValue || ""}
          ref={searchInputRef}
        />
        <Button type="submit" variant="outline" size="icon">
          <Search />
        </Button>
      </form>
    </nav>
  )
}

export default memo(AppNavbar)
