import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type TProps = {
  isLiked: boolean
}

const CosmeticBagLikeBtn = ({ isLiked }: TProps) => {
  return (
    <div className="hidden">
      <Button
        // onClick={handleRemoveFromFavorite}
        // disabled={isToggleLoading}
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full hover:bg-accent",
          isLiked ? "text-red-500" : "text-muted-foreground"
        )}
      >
        <Heart fill="red" stroke="red" />
      </Button>
    </div>
  )
}

export default CosmeticBagLikeBtn
