import ProductFilters from "@/components/HomeComponents/ProductFilters"
import Product from "@/components/HomeComponents/Product"
import SideBar from "@/components/HomeComponents/SIdeBar"
import { useGetAllItems } from "@/hooks/getAllItems"
import { useGetCategories } from "@/hooks/getCategories"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useMemo } from "react"
import { PaginationButtons } from "@/components/Pagination"
// import { useLocation, useSearchParams } from "react-router"

const HomePage = () => {
  const { data: products, isLoading: isLoadingItems } = useGetAllItems()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  // const { pathname } = useLocation()
  // const [searchParams] = useSearchParams()

  // const selectedBrands = searchParams.getAll("brand")
  // const selectedSkinTypes = searchParams.getAll("skinType")
  // const selectedFilterCategories = searchParams.getAll("category")

  // console.log(
  //   selectedBrands,
  //   decodeURIComponent(pathname.split("/").at(-1) || "")
  // )

  return (
    <main className="min-h-screen w-full flex max-md:flex-col items-start justify-center p-4">
      <SideBar categoryTree={categoryTree} />
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <ProductFilters />
        {!isLoadingItems && (
          <div className="flex items-start justify-center w-full flex-wrap">
            {products.length === 0 ? (
              <p>Ничего не найдено</p>
            ) : (
              products.map((product) => (
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
