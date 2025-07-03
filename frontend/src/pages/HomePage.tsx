import Item from "@/components/HomeComponents/Item"
import SideBar from "@/components/HomeComponents/SIdeBar"
import { useGetAllItems } from "@/hooks/getAllItems"
import { useGetCategories } from "@/hooks/getCategories"
import { buildCategoryTree } from "@/lib/buildCategoryTree"
import { useMemo } from "react"

const HomePage = () => {
  const { data: items, isLoading: isLoadingItems } = useGetAllItems()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()

  const categoryTree = useMemo(
    () => buildCategoryTree(isLoadingCategories ? [] : categories),
    [categories, isLoadingCategories]
  )

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <SideBar categoryTree={categoryTree} />
      {!isLoadingItems && (
        <div className="flex items-center justify-center w-full flex-wrap">
          {items.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}

export default HomePage
