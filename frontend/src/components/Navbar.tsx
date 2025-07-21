import { Link, useNavigate, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import { useTranslation } from "react-i18next"
import { Heart, HomeIcon, List, SearchIcon } from "lucide-react"
import { memo, useMemo, useState } from "react"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useGetCategories } from "@/hooks/getCategories"
import SearchDialogModal from "./SearchDialogModal"
import MobileCatalogModal from "./HeaderComponents/MobileCatalogModal"
import DropDownMenu from "./HeaderComponents/DropDownMenu"

const AppNavbar: React.FC = () => {
  const { t } = useTranslation()
  const user = useAuth()
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false)
  const [searchParams] = useSearchParams()

  const isAdmin = user?.role?.includes(ROLES.ADMIN)
  const isUser = user?.role?.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const { data: favorites } = useGetAllFavProducts({
    enabled: !!isAuthenticated,
  })

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()
  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  const getFiltersQuantity = () => {
    if (searchParams.size > 0) {
      return searchParams.size
    }
    return 0
  }

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

  const handleOpenSearchModal = () => {
    user?.refetch()
    setIsSearchOpen(true)
  }

  return (
    <header className="flex flex-col w-full shadow-md px-sides border-b-1">
      <nav className="flex items-center justify-between py-4 max-md:py-3 flex-wrap gap-2">
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-900">
          Beauty Guide
        </Link>

        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full ml-auto"
          onClick={handleOpenSearchModal}
        >
          <p className="absolute -top-2 -left-2 bg-blue-900 text-center text-white rounded-full w-5 h-5 flex items-center justify-center">
            {getFiltersQuantity()}
          </p>
          <SearchIcon />
        </Button>
        <DropDownMenu
          handleNagivate={handleNagivate}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          user={user}
          isAdmin={isAdmin || false}
          isAuthenticated={isAuthenticated || false}
          favorites={favorites || []}
        />
      </nav>

      <SearchDialogModal
        open={isSearchOpen}
        setOpen={setIsSearchOpen}
        userHistory={user?.history || []}
      />

      <div className="fixed bg-gray-300/60 backdrop-blur-xl left-0 bottom-0 hidden max-md:flex items-center gap-4 p-4 h-[80px] w-full z-10">
        {/* <span className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full"
            // onClick={handleOpenSearchModal}
          >
            <p className="absolute -top-2 -left-2 bg-blue-900 text-center text-white rounded-full w-5 h-5 flex items-center justify-center">
              {getFiltersQuantity()}
            </p>
            <SearchIcon />
          </Button>
          <p className="text-neutral-800 font-semibold text-xs">
            {t("Search")}
          </p>
        </span> */}
        <span className="flex flex-col items-center">
          <Button
            variant="outline"
            className=" bg-white/80 backdrop-blur-xl text-black"
            onClick={() => {
              navigate("/")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <HomeIcon />
          </Button>
          <p className="text-neutral-800 font-semibold text-xs">
            {t("nav.home")}
          </p>
        </span>
        <span className="flex flex-col items-center">
          <Button
            variant="outline"
            className=" bg-white/80 backdrop-blur-xl text-black shadow-2xl"
            onClick={() => setIsCatalogOpen(true)}
          >
            <List />
          </Button>
          <p className="text-neutral-800 font-semibold text-xs">
            {t("nav.catalogs")}
          </p>
        </span>
        {isAuthenticated && (
          <span className="flex flex-col items-center">
            <Button
              variant="outline"
              className=" bg-white/80 backdrop-blur-xl text-black"
              onClick={() => handleNagivate("/favorites")}
            >
              <Heart />
            </Button>
            <p className="text-neutral-800 font-semibold text-xs">
              {t("favorites")}
            </p>
          </span>
        )}
        <MobileCatalogModal
          categoryTree={categoryTree}
          isOpen={isCatalogOpen}
          setIsOpen={setIsCatalogOpen}
        />
      </div>
    </header>
  )
}

export default memo(AppNavbar)
