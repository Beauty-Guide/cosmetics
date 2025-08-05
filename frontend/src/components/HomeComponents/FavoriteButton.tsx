import { useGetAllFavProducts } from "@/hooks/fav-products/getAllFavProducts"
import { useToggleFavProduct } from "@/hooks/fav-products/useToggleFavProduct"
import { memo, useMemo } from "react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  productId: string
  label?: string
}

const FavoriteButton = ({ productId, label }: Props) => {
  const { data: favourites, isLoading } = useGetAllFavProducts()
  const { mutate: toggleFav, isPending: isToggleLoading } =
    useToggleFavProduct()

  const handleAddToFavorite = () => {
    toggleFav({ productId: String(productId), action: "add" })
  }

  const handleRemoveFromFavorite = () => {
    toggleFav({ productId: String(productId), action: "remove" })
  }

  const isFavorite = useMemo(() => {
    return favourites?.some((fav) => String(fav.id) === productId)
  }, [favourites, productId])

  if (isLoading) {
    return <Skeleton className="h-[36px] w-[160px] rounded-md" />
  }
  if (isFavorite) {
    return (
      <Button
        onClick={handleRemoveFromFavorite}
        disabled={isToggleLoading}
        variant="ghost"
        size={label ? "default" : "icon"}
        className={cn(
          "relative rounded-full hover:bg-accent",
          isFavorite ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="red" stroke="red" />
        {label && <p className="text-gray-800">{label}</p>}
      </Button>
    )
  } else {
    return (
      <Button
        onClick={handleAddToFavorite}
        disabled={isToggleLoading}
        variant="ghost"
        size={label ? "default" : "icon"}
        className={cn(
          "rounded-full hover:bg-accent",
          isFavorite ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="#fff" />
        {label && <p className="text-gray-800">{label}</p>}
      </Button>
    )
  }
}

export default memo(FavoriteButton)
