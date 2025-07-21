import type { TCategory } from "@/types"
import CategoryItem from "./CategoryItem"
import { useTranslation } from "react-i18next"

type CatalogProps = {
  categoryTree: TCategory[]
}

const Catalog = ({ categoryTree }: CatalogProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4 w-[300px] max-md:hidden">
      <h1 className="text-3xl text-blue-900 font-bold">{t("categories")}</h1>
      <div>
        {categoryTree.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}

export default Catalog
