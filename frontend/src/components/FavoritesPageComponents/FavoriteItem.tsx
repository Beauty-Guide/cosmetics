import { getImgUrl } from "@/lib/utils"
import type { TProduct } from "@/types"
import { useNavigate } from "react-router"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useToggleFavProduct } from "@/hooks/useToggleFavProduct"
import { useTranslation } from "react-i18next"

type TFavoriteItemProps = {
  product: TProduct
}

const FavoriteItem = ({ product }: TFavoriteItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate: toggleFav, isPending: isToggleLoading } =
    useToggleFavProduct()

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  const handleRemoveFromFavorite = () => {
    toggleFav({ productId: String(product.id), action: "remove" })
  }

  return (
    <div className="flex items-start justify-start max-md:flex-wrap mt-5 w-full gap-5 p-4 rounded-md shadow-sm hover:shadow-md">
      <div className="flex flex-col items-start gap-2">
        <img
          src={getImgUrl(product.images.find((img) => img.isMain)?.url)}
          alt=""
          className="max-h-[200px] max-w-[400px] rounded-md cursor-pointer"
          onClick={navigateToItem}
        />
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground my-2">{product.description}</p>
        <Button
          variant="outline"
          size="sm"
          disabled={isToggleLoading}
          onClick={handleRemoveFromFavorite}
        >
          {t("product.remove_from_fav")}
        </Button>
      </div>
      <div className="flex gap-6 flex-wrap">
        <span className="flex flex-col items-start gap-2 bg-white p-3 rounded h-min">
          <h2 className="mb-2 text-2xl max-md:text-xl font-bold">
            {t("product.actions")}
          </h2>
          {product.actions
            ? product.actions.map((action) => (
                <Badge
                  key={action.id}
                  variant="outline"
                  className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
                >
                  ✓ {action.name}
                </Badge>
              ))
            : null}
        </span>
        <span className="flex flex-col gap-2 bg-white p-3 rounded-md h-min">
          <h2 className="mb-2 text-2xl max-md:text-xl font-bold">
            {t("product.skinTypes")}
          </h2>
          {product.skinTypes
            ? product.skinTypes.map((skinType) => (
                <Badge
                  key={skinType.id}
                  variant="outline"
                  className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
                >
                  ✓ {skinType.name}
                </Badge>
              ))
            : null}
        </span>
      </div>
    </div>
  )
}

export default FavoriteItem
