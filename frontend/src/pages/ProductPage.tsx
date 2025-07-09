import { ImageCarousel } from "@/components/ImageCarousel"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useItemById } from "@/hooks/getItemById"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"

const ProductPage = () => {
  const { t } = useTranslation()
  const { productId } = useParams()
  const { data: product, isLoading: isLoadingProduct } = useItemById(
    productId || ""
  )

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-start w-full p-4 px-sides">
        <Skeleton className="h-[400px] w-full rounded-md p-4 my-5" />
      </div>
    )
  }

  if (!product) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-left p-4 px-sides">
          {t("product.notFound")}
        </h1>
      </div>
    )
  }

  return (
    <main className="flex flex-col w-full items-start justify-start gap-5 p-4 px-sides">
      <span className="flex flex-col items-start justify-center gap-2 my-2 max-md:my-0">
        <h1 className="text-3xl font-bold text-left max-md:text-xl">
          {product.name}
        </h1>
        <p className="text-muted-foreground text-sm">{product.brand.name}</p>
      </span>
      <div className="flex gap-15 max-lg:flex-col max-md:gap-2">
        <div>
          <ImageCarousel
            images={
              product.images.length === 0
                ? [{ id: "12312", url: "", isMain: true }]
                : product.images
            }
          />
        </div>
        <div className="flex gap-6 max-md:gap-1">
          {product.actions.length && (
            <span className="flex flex-col items-start gap-2 bg-white p-3 rounded h-min">
              <h2 className="mb-2 text-2xl max-md:text-lg font-bold">
                {t("product.actions")}
              </h2>
              {product.actions.map((action) => (
                <Badge
                  key={action.id}
                  variant="outline"
                  className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-8 rounded-2xl"
                >
                  ✓ {action.name}
                </Badge>
              ))}
            </span>
          )}
          {product.skinTypes.length && (
            <span className="flex flex-col gap-2 bg-white p-3 rounded-md h-min">
              <h2 className="mb-2 text-2xl max-md:text-lg font-bold">
                {t("product.skinTypes")}
              </h2>
              {product.skinTypes.map((skinType) => (
                <Badge
                  key={skinType.id}
                  variant="outline"
                  className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-8 rounded-2xl"
                >
                  ✓ {skinType.name}
                </Badge>
              ))}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-4 flex-wrap max-md:gap-1">
        {product.ingredients.length && (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.ingredients")}
            </h2>
            <ul className="font-semibold max-md:text-sm">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient.id}>- {ingredient.name}</li>
              ))}
            </ul>
          </span>
        )}
        {product.compatibility && (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.compatibility")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.compatibility}
            </p>
          </span>
        )}
        {product.usageRecommendations && (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.usageRecommendations")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.usageRecommendations}
            </p>
          </span>
        )}
        {product.applicationMethod && (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.applicationMethod")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.applicationMethod}
            </p>
          </span>
        )}
      </div>
    </main>
  )
}

export default ProductPage
