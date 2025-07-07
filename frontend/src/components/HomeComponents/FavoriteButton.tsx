import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"
import { useToggleFavProduct } from "@/hooks/useToggleFavProduct"
import { memo, useMemo } from "react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const FavoriteButton = ({ productId }: { productId: string }) => {
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
        size="icon"
        className={cn(
          "rounded-full hover:bg-accent",
          isFavorite ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="red" stroke="red" />
      </Button>
    )
  } else {
    return (
      <Button
        onClick={handleAddToFavorite}
        disabled={isToggleLoading}
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-accent",
          isFavorite ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="#fff" />
      </Button>
    )
  }
}

export default memo(FavoriteButton)
