import { useGetAllItems } from "@/hooks/getAllItems"
import type { TProduct } from "@/types"
import { useTranslation } from "react-i18next"
import Product from "../HomeComponents/Product"
import { useMemo } from "react"

type Props = {
  product: TProduct
}

const SimilarProducts = ({ product }: Props) => {
  const { t } = useTranslation()
  const { data: similarProducts, isLoading: isLoadingItems } = useGetAllItems({
    page: 0,
    size: 5,
    sortBy: "id",
    sortDirection: "ASC",
    // brandIds: [String(product.brand.id)],
    skinTypeIds: product.skinTypes.map((skinType) => String(skinType.id)),
    actionIds: product.actions.map((action) => String(action.id)),
    catalogId: String(product.catalog.id),
  })

  const filteredProducts = useMemo(
    () => similarProducts?.cosmetics.filter((item) => item.id !== product.id),
    [similarProducts, product]
  )

  if (isLoadingItems) {
    return <div>Loading...</div>
  }

  if (!filteredProducts?.length) {
    return null
  }

  return (
    <div className="flex flex-col items-start justify-start w-full px-sides mb-2 max-md:mb-10">
      <h1 className="text-2xl font-semibold text-left select-none my-2">
        {t("product.similar_products")}
      </h1>
      <div className="flex items-start justify-start w-full flex-wrap gap-4">
        {filteredProducts?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default SimilarProducts
