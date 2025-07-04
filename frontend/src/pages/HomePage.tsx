import ProductFilters from "@/components/HomeComponents/ProductFilters"
import Product from "@/components/HomeComponents/Product"
import SideBar from "@/components/HomeComponents/SIdeBar"
import { useGetAllItems } from "@/hooks/getAllItems"
import { useGetCategories } from "@/hooks/getCategories"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useMemo } from "react"

const HomePage = () => {
  const { data: products, isLoading: isLoadingItems } = useGetAllItems()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  return (
    <main className="min-h-screen w-full flex items-start justify-center p-4">
      <SideBar categoryTree={categoryTree} />
      <div className="flex flex-col gap-4 w-full">
        <ProductFilters />
        {!isLoadingItems && (
          <div className="flex items-start justify-center w-full flex-wrap">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default HomePage
