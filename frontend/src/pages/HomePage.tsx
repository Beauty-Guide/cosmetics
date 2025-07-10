import ProductFilters from "@/components/HomeComponents/ProductFilters"
import Products from "@/components/HomeComponents/Products"
import SideBar from "@/components/HomeComponents/SIdeBar"
import Pagination from "@/components/Pagination"
import { useGetAllItems } from "@/hooks/getAllItems"
import { useGetCategories } from "@/hooks/getCategories"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useEffect, useMemo, useState } from "react"
import { useLocation, useSearchParams } from "react-router"
import { PAGE_SIZE } from "@/config/consts"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

const HomePage = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    searchParams.getAll("skinType")
  )
  const [selectedAction, setSelectedAction] = useState<string[]>(
    searchParams.getAll("cosmeticAction")
  )
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string | null>(
    searchParams.get("search")
  )
  const [sortBy, setSortBy] = useState<string[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const { data: products, isLoading: isLoadingItems } = useGetAllItems({
    page: page - 1,
    size: PAGE_SIZE,
    sortBy: "id",
    sortDirection: "ASC",
    brandIds: selectedBrands,
    skinTypeIds: selectedSkinTypes,
    actionIds: selectedAction,
    catalogId: categoryId,
    byDate: sortBy.includes("byDate"),
    byFavourite: sortBy.includes("byFavourite"),
    byPopularity: sortBy.includes("byPopularity"),
    name: searchValue,
  })

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  useEffect(() => {
    const id = categories?.find(
      (c) => c.name === decodeURIComponent(pathname.split("/").at(-1) || "")
    )?.id

    if (id) {
      setCategoryId(String(id))
    } else {
      setCategoryId(null)
    }
    setPage(1)
  }, [categories, searchParams, pathname])

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
    setSelectedSkinTypes(searchParams.getAll("skinType"))
    setSelectedAction(searchParams.getAll("cosmeticAction"))
    setSearchValue(searchParams.get("search"))

    setPage(1)
  }, [pathname, searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    selectedBrands.forEach((b) => params.append("brand", b))
    selectedSkinTypes.forEach((s) => params.append("skinType", s))
    selectedAction.forEach((a) => params.append("cosmeticAction", a))

    if (searchValue) {
      params.append("search", searchValue)
    }

    setSearchParams(params, { replace: false })
  }, [
    selectedBrands,
    selectedSkinTypes,
    selectedAction,
    searchValue,
    setSearchParams,
  ])

  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  const totalPages = useMemo(() => {
    if (products) {
      return Math.ceil(products.total / PAGE_SIZE)
    } else {
      return 1
    }
  }, [products])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  return (
    <main className="w-full flex max-md:flex-col items-start justify-center p-4 mt-2 max-md:pt-0 px-sides">
      <SideBar
        categoryTree={categoryTree}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
      <div className="flex flex-col items-center justify-center w-full mt-1">
        <div className="flex items-center justify-between w-full gap-3">
          <Button
            variant="outline"
            className="my-2 hidden max-md:block"
            onClick={handleOpenDrawer}
          >
            <List />
          </Button>
          <h2 className="flex gap-2 text-md font-semibold mr-auto">
            {isLoadingItems ? (
              <Skeleton className="w-[100px] h-[24px]" />
            ) : (
              `${t("product.found")}: ${products?.total || 0}`
            )}
          </h2>
        </div>

        <ProductFilters
          selectedBrands={selectedBrands}
          selectedSkinTypes={selectedSkinTypes}
          selectedAction={selectedAction}
          selectedSortBy={sortBy}
          setSelectedBrands={setSelectedBrands}
          setSelectedSkinTypes={setSelectedSkinTypes}
          setSelectedAction={setSelectedAction}
          setSelectedSortBy={setSortBy}
        />
        <Products
          products={products?.cosmetics || []}
          isLoading={isLoadingItems}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
          siblingCount={2}
          boundaryCount={1}
        />
      </div>
    </main>
  )
}

export default HomePage
