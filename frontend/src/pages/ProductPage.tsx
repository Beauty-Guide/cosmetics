import FavoriteButton from "@/components/HomeComponents/FavoriteButton"
import { ImageCarousel } from "@/components/ImageCarousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import { useItemById } from "@/hooks/getItemById"
import { Share2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { toast } from "sonner"

const ProductPage = () => {
  const { t, i18n } = useTranslation()
  const { productId } = useParams()
  const { data: product, isLoading: isLoadingProduct } = useItemById(
    productId || ""
  )
  const user = useAuth()
  const isAdmin = user?.role.includes(ROLES.ADMIN)
  const isUser = user?.role.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t("product.linkCopied"))
  }

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
  console.log(i18n.language)

  return (
    <main className="flex flex-col w-full justify-start gap-5 p-4 px-sides">
      <span className="flex flex-col items-start justify-center gap-2 my-2 max-md:my-0">
        <h1 className="text-3xl font-bold text-left max-md:text-xl">
          {product.name}
        </h1>
        <p className="text-muted-foreground text-sm">{product.brand.name}</p>
      </span>
      <div className="flex gap-15 max-lg:flex-col max-md:gap-2">
        <div className="relative">
          <ImageCarousel
            images={
              product.images.length === 0
                ? [{ id: "12312", url: "", isMain: true }]
                : product.images
            }
          />
          {isAuthenticated && (
            <span className="flex flex-col items-center justify-center absolute top-2 right-1">
              <FavoriteButton productId={String(product.id)} />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent"
                onClick={handleShare}
              >
                <Share2Icon className="w-5 h-5" />
              </Button>
            </span>
          )}
        </div>
        <div className="flex gap-6 max-md:gap-1">
          {product.actions.length ? (
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
          ) : null}
          {product.skinTypes.length ? (
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
          ) : null}
        </div>
      </div>
      <div className="flex gap-4 flex-wrap max-md:gap-1">
        {product.ingredients.length ? (
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
        ) : null}
        {product.compatibility ? (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.compatibility")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.compatibility}
            </p>
          </span>
        ) : null}
        {product.usageRecommendations ? (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.usageRecommendations")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.usageRecommendations}
            </p>
          </span>
        ) : null}
        {product.applicationMethod ? (
          <span className="flex flex-col bg-white p-4 max-md:py-2 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.applicationMethod")}
            </h2>
            <p className="font-semibold max-md:text-sm">
              {product.applicationMethod}
            </p>
          </span>
        ) : null}
        {product.marketplaceLinks && product.marketplaceLinks?.length > 0 ? (
          <div className="flex flex-col p-4 w-full gap-2 bg-white my-4 max-md:my-1 rounded-md">
            <h2 className="mb-1 text-xl max-md:text-lg font-bold">
              {t("product.marketplaceLinks")}
            </h2>
            <span className="flex gap-2 flex-wrap font-semibold max-md:text-sm">
              {product.marketplaceLinks
                .filter((l) => l.locale === i18n.language.toUpperCase())
                .map((marketplaceLink) => (
                  <a
                    href={marketplaceLink.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Badge
                      className="w-25 h-8 max-md:w-45 max-md:h-8"
                      variant="outline"
                      key={marketplaceLink.id}
                    >
                      {marketplaceLink.name}
                    </Badge>
                  </a>
                ))}
            </span>
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default ProductPage
