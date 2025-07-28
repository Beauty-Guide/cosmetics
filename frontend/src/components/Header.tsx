import { Link, useNavigate, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import { useGetAllFavProducts } from "@/hooks/fav-products/getAllFavProducts"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import {
  Heart,
  HomeIcon,
  List,
  SearchIcon,
  ShoppingBasketIcon,
} from "lucide-react"
import { memo, useMemo, useState } from "react"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useGetCategories } from "@/hooks/getCategories"
import SearchDialogModal from "./SearchDialogModal"
import MobileCatalogModal from "./HeaderComponents/MobileCatalogModal"
import DropDownMenu from "./HeaderComponents/DropDownMenu"
import { cn } from "@/lib/utils"

const Header: React.FC = () => {
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
          className="relative rounded-full ml-auto max-md:hidden"
          onClick={handleOpenSearchModal}
        >
          <p
            className={cn(
              "absolute -top-2 -left-2 bg-blue-900 text-center text-white rounded-full w-5 h-5 flex items-center justify-center",
              !getFiltersQuantity() && "hidden"
            )}
          >
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

      <div className="hidden max-md:flex fixed bg-gray-300/60 backdrop-blur-xl left-0 bottom-0 items-center justify-center gap-4 py-3 h-fit w-full z-10">
        <span className="flex items-center justify-between w-3/4">
          <Button
            variant="outline"
            className="text-black rounded-full w-12 h-12"
            size="icon"
            onClick={() => setIsCatalogOpen(true)}
          >
            <List />
          </Button>
          <Button
            variant="outline"
            className="relative rounded-full w-12 h-12"
            size="icon"
            onClick={handleOpenSearchModal}
          >
            <p
              className={cn(
                "absolute -top-2 -left-2 bg-blue-900 text-center text-white rounded-full w-5 h-5 flex items-center justify-center",
                !getFiltersQuantity() && "hidden"
              )}
            >
              {getFiltersQuantity()}
            </p>
            <SearchIcon />
          </Button>
          <Button
            variant="outline"
            className="text-black rounded-full w-12 h-12"
            size="icon"
            onClick={() => {
              navigate("/")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <HomeIcon />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "text-black rounded-full w-12 h-12",
              !isAuthenticated && "hidden"
            )}
            size="icon"
            onClick={() => handleNagivate("/favorites")}
          >
            <Heart />
          </Button>
          <Button
            variant="outline"
            className={cn(
              "text-black rounded-full w-12 h-12",
              !isAuthenticated && "hidden"
            )}
            size="icon"
            onClick={() => handleNagivate("/cosmetic-bag")}
          >
            <ShoppingBasketIcon />
          </Button>
        </span>
      </div>
      <MobileCatalogModal
        categoryTree={categoryTree}
        isOpen={isCatalogOpen}
        setIsOpen={setIsCatalogOpen}
      />
    </header>
  )
}

export default memo(Header)
