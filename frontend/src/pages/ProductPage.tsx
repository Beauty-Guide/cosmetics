import { ImageCarousel } from "@/components/ImageCarousel"
import { Badge } from "@/components/ui/badge"
import { useItemById } from "@/hooks/getItemById"
import { useParams } from "react-router"

const ProductPage = () => {
  const { productId } = useParams()
  const { data: product, isLoading: isLoadingProduct } = useItemById(
    productId || ""
  )

  if (isLoadingProduct) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Такого товара не существует</div>
  }

  return (
    <main className="flex flex-col w-full items-center justify-center gap-5 p-4">
      <span className="flex flex-col items-start justify-center gap-2 my-2">
        <h1 className="text-3xl font-bold text-left">{product.name}</h1>
        <p className="">{product.brand.name}</p>
      </span>
      <div className="flex gap-15 max-md:flex-col">
        <div className="px-2">
          <ImageCarousel
            images={
              product.imageUrls.length === 0
                ? ["/600x400.svg"]
                : product.imageUrls
            }
          />
        </div>
        <div className="flex gap-6">
          <span className="flex flex-col items-start gap-2">
            <h2 className="mb-2 text-2xl max-md:text-xl font-bold">Действия</h2>
            {product.actions.map((action) => (
              <Badge
                key={action.id}
                variant="outline"
                className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
              >
                ✓ {action.name}
              </Badge>
            ))}
          </span>
          <span className="flex flex-col gap-2">
            <h2 className="mb-2 text-2xl max-md:text-xl font-bold">
              Типы кожи
            </h2>
            {product.skinTypes.map((skinType) => (
              <Badge
                key={skinType.id}
                variant="outline"
                className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
              >
                ✓ {skinType.name}
              </Badge>
            ))}
          </span>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            СОВМЕСТИМОСТЬ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.compatibility}
          </p>
        </span>
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            РЕКОМЕНДАЦИИ ПО ПРИМЕНЕНИЮ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.usageRecommendations}
          </p>
        </span>
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            СПОСОБ ПРИМЕНЕНИЯ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.applicationMethod}
          </p>
        </span>
      </div>
    </main>
  )
}

export default ProductPage
