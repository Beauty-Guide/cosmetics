import { getImgUrl } from "@/lib/utils"
import type { TProduct } from "@/types"
import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import { useToggleFavProduct } from "@/hooks/useToggleFavProduct"
import { Heart } from "lucide-react"

type TFavoriteItemProps = {
  product: TProduct
}

const FavoriteItem = ({ product }: TFavoriteItemProps) => {
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
    <div className="relative flex items-start justify-start max-md:flex-wrap mt-5 w-full gap-5 p-4 rounded-md shadow-sm hover:shadow-md">
      <div className="flex flex-col items-start gap-2 overflow-hidden">
        <img
          src={getImgUrl(product.images.find((img) => img.isMain)?.url)}
          alt=""
          className="max-h-[200px] max-w-[400px] rounded-md cursor-pointer"
          onClick={navigateToItem}
        />
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground my-2">{product.description}</p>
      </div>
      <Button
        onClick={handleRemoveFromFavorite}
        disabled={isToggleLoading}
        variant="ghost"
        size="icon"
        className={
          "absolute top-3 right-2 rounded-full hover:bg-accent text-red-500"
        }
      >
        <Heart fill="red" stroke="red" />
      </Button>
    </div>
  )
}

export default FavoriteItem
