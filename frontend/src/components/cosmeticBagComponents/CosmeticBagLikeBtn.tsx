import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToggleLikeCosmeticBag } from "@/hooks/cosmetic-bag/useToggleLikeCosmeticBag"
import { useParams } from "react-router"
import { Skeleton } from "../ui/skeleton"
import { useMemo } from "react"
import { useCosmeticBags } from "@/hooks/cosmetic-bag/useCosmeticBags"

const CosmeticBagLikeBtn = () => {
  const { id } = useParams()
  const { data: cosmeticBagsLiked, isLoading: isLoadingCosmeticBagsLiked } =
    useCosmeticBags({ liked: true })
  const { mutate: toggleLikeCosmeticBag, isPending: isToggleLoading } =
    useToggleLikeCosmeticBag()

  const handleLike = () => {
    toggleLikeCosmeticBag({ id: String(id), action: "like" })
  }

  const handleUnlike = () => {
    toggleLikeCosmeticBag({ id: String(id), action: "unlike" })
  }

  const isLiked = useMemo(() => {
    return cosmeticBagsLiked?.some((fav) => String(fav.id) === id)
  }, [cosmeticBagsLiked, id])

  if (isLoadingCosmeticBagsLiked) {
    return <Skeleton className="h-[36px] w-[160px] rounded-md" />
  }
  if (isLiked) {
    return (
      <Button
        onClick={handleUnlike}
        disabled={isToggleLoading}
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full hover:bg-accent",
          isLiked ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="red" stroke="red" />
      </Button>
    )
  } else {
    return (
      <Button
        onClick={handleLike}
        disabled={isToggleLoading}
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full hover:bg-accent",
          isLiked ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="#fff" />
      </Button>
    )
  }
}

export default CosmeticBagLikeBtn
