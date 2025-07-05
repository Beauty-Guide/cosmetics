import ProductFilters from "@/components/HomeComponents/ProductFilters"
import Product from "@/components/HomeComponents/Product"
import SideBar from "@/components/HomeComponents/SIdeBar"
import { useGetAllItems } from "@/hooks/getAllItems"
import { useGetCategories } from "@/hooks/getCategories"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useEffect, useMemo, useState } from "react"
import { PaginationButtons } from "@/components/Pagination"
import { Input } from "@/components/ui/input"
import { useLocation, useSearchParams } from "react-router"
import { PAGE_SIZE } from "@/config/consts"

const HomePage = () => {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    searchParams.getAll("skinType")
  )
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const { data: products, isLoading: isLoadingItems } = useGetAllItems({
    page: 0,
    size: PAGE_SIZE,
    sortBy: "id",
    sortDirection: "ASC",
    brandIds: selectedBrands,
    skinTypeIds: selectedSkinTypes,
    catalogId: categoryId,
  })

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  useEffect(() => {
    const id = categories?.find(
      (c) => c.name === decodeURIComponent(pathname.split("/").at(-1) || "")
    )?.id

    if (id) {
      setCategoryId(String(id))
    }
  }, [categories, searchParams, pathname])

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
    setSelectedSkinTypes(searchParams.getAll("skinType"))
  }, [pathname, searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    selectedBrands.forEach((b) => params.append("brand", b))
    selectedSkinTypes.forEach((s) => params.append("skinType", s))

    setSearchParams(params, { replace: false })
  }, [selectedBrands, selectedSkinTypes, setSearchParams])

  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  return (
    <main className="min-h-screen w-full flex max-md:flex-col items-start justify-center p-4 pt-8 max-md:pt-0">
      <SideBar categoryTree={categoryTree} />
      <div className="flex flex-col items-center justify-center gap-4 w-full mt-1">
        <Input type="search" placeholder="Поиск" className="max-w-md mr-auto" />
        <ProductFilters
          selectedBrands={selectedBrands}
          selectedSkinTypes={selectedSkinTypes}
          setSelectedBrands={setSelectedBrands}
          setSelectedSkinTypes={setSelectedSkinTypes}
        />
        {!isLoadingItems && (
          <div className="flex items-start justify-center w-full flex-wrap">
            {products?.cosmetics.length === 0 ? (
              <p>Ничего не найдено</p>
            ) : (
              products?.cosmetics.map((product) => (
                <Product key={product.id} product={product} />
              ))
            )}
            <PaginationButtons pages={5} />
          </div>
        )}
      </div>
    </main>
  )
}

export default HomePage
