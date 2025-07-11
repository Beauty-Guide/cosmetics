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
import { User2Icon } from "lucide-react"
import { memo, useEffect, useRef, useState } from "react"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { cn } from "@/lib/utils"
import SearchInput from "./SearhInput"
import { useDeleteSearchHistory } from "@/hooks/useDeleteSearhHistory"
import type { TUserHistory } from "@/types"

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
  const [searchHistory, setSearchHistory] = useState<TUserHistory[]>([])

  const isAdmin = user?.role.includes(ROLES.ADMIN)
  const isUser = user?.role.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const { data: favorites } = useGetAllFavProducts({
    enabled: !!isAuthenticated,
  })
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()
  const { mutate: deleteSearchHistory } = useDeleteSearchHistory()
  const showFilter = pathname === "/" || pathname.startsWith("/category")

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
  }, [pathname, searchParams])

  useEffect(() => {
    if (user?.history) {
      setSearchHistory(user.history)
    }
  }, [user])

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams()
    const searchValue = searchInputRef.current?.value.trim()

    if (searchValue && searchValue.length > 2) {
      params.append("search", searchValue)
      setSearchHistory((prev) => [
        ...prev,
        { id: prev.length + 1, searchQuery: searchValue },
      ])
    } else if (!searchValue) {
      params.delete("search")
      setSearchParams(params, { replace: false })
    }

    if (selectedBrands.length > 0) {
      selectedBrands.forEach((b) => {
        params.append("brand", b)
      })
    } else {
      params.delete("brand")
    }

    if (searchValue && searchValue.length > 2) {
      navigate(`/?${params.toString()}`)
    }
  }

  const handleSelectOption = (option: string) => {
    const params = new URLSearchParams()
    params.append("search", option)
    if (searchInputRef.current) searchInputRef.current.value = option
    setSearchParams(params, { replace: false })
  }

  const handleDeleteHistoryOption = (id: number) => {
    deleteSearchHistory(id.toString())
    if (searchInputRef.current) searchInputRef.current.value = ""
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
              <DropdownMenuItem onClick={handleLogin}>
                {t("login")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center justify-start mb-4 z-40"
      >
        {
          <div className="max-w-[86px] rounded-r-none rounded-l-md border-1 border-r-0 overflow-hidden">
            {!isLoadingBrands && (
              <FilterCombobox
                label={t("filter.brand")}
                options={brands}
                values={selectedBrands}
                onChange={setSelectedBrands}
                labels={false}
                badges={false}
                showOnlyLabel={true}
                variant="ghost"
                className={cn(
                  "max-w-[86px]",
                  selectedBrands.length > 0 && "bg-blue-50",
                  showFilter && "hidden"
                )}
              />
            )}
          </div>
        }
        <SearchInput
          placeholder={t("search")}
          className={cn(
            "max-w-[550px] border-r-0 rounded-r-none focus-visible:ring-[0px]",
            !showFilter && "border-l-0 rounded-l-none"
          )}
          ref={searchInputRef}
          searchHistory={searchHistory}
          defaultValue={searchValue || ""}
          handleSelectOption={handleSelectOption}
          handleDeleteHistoryOption={handleDeleteHistoryOption}
        />
      </form>
    </nav>
  )
}

export default memo(AppNavbar)
