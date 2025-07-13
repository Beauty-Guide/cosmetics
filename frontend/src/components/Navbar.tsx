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
import {SlidersIcon, User2Icon, XIcon} from "lucide-react"
import { memo, useEffect, useRef, useState } from "react"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { cn } from "@/lib/utils"
import SearchInput from "./SearhInput"
import { useDeleteSearchHistory } from "@/hooks/useDeleteSearhHistory"
import type { TUserHistory } from "@/types"
import {SearchWithFilters} from "@/components/HomeComponents/SearchWithFilters.tsx";


const AppNavbar: React.FC = () => {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const user = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchValue = searchParams.get("search")
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.getAll("brand"))
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(searchParams.getAll("skinType"))
  const [selectedAction, setSelectedAction] = useState<string[]>(searchParams.getAll("action"))
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>(searchParams.getAll("sortBy"))
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

  const handleSubmitFilters = () => {
    const params = new URLSearchParams()
    selectedBrands.forEach((b) => params.append("brand", b))
    selectedSkinTypes.forEach((s) => params.append("skinType", s))
    selectedAction.forEach((a) => params.append("cosmeticAction", a))
    setSearchParams(params)
  }

  return (
    <nav className="flex flex-col w-full shadow-md px-sides border-b-1">
      <div className="flex items-center justify-between py-4 max-md:py-3 gap-2">
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-900" style={{width:"20%"}}>
          Beauty Guide
        </Link>
        <SearchWithFilters
            selectedBrands={selectedBrands}
            selectedSkinTypes={selectedSkinTypes}
            selectedAction={selectedAction}
            selectedSortBy={selectedSortBy}
            setSelectedBrands={setSelectedBrands}
            setSelectedSkinTypes={setSelectedSkinTypes}
            setSelectedAction={setSelectedAction}
            setSelectedSortBy={setSelectedSortBy}
            onSubmitFilters={handleSubmitFilters}
        />
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
                    <Link
                      to="/admin"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
                    >
                      {t("nav.cosmetic")}
                    </Link>
                    <Link
                      to="/admin/catalog"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
                    >
                      {t("nav.catalogs")}
                    </Link>
                    <Link
                      to="/admin/brand"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
                    >
                      {t("nav.brands")}
                    </Link>
                    <Link
                      to="/admin/skinType"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
                    >
                      {t("nav.skinTypes")}
                    </Link>
                    <Link
                      to="/admin/action"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
                    >
                      {t("nav.actions")}
                    </Link>
                    <Link
                      to="/admin/ingredient"
                      className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 text-sm outline-hidden"
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
    </nav>
  )
}

export default memo(AppNavbar)
