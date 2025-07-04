import type { TCategory } from "@/types"
import CategoryItem from "./CategoryItem"

type SideBarProps = {
  categoryTree: TCategory[]
}

const SideBar = ({ categoryTree }: SideBarProps) => {
  return (
    <div className="flex flex-col gap-4 w-[500px] max-md:hidden">
      <h1 className="text-3xl text-blue-500 font-bold">Категории</h1>
      <div>
        {categoryTree.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}

export default SideBar
