import type { TCosmeticBag } from "@/types"
import { Link } from "react-router"
import { Button } from "../ui/button"
import { Heart, Share2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { memo } from "react"
import { cn } from "@/lib/utils"

type TCosmeticBagProps = {
  cosmeticBag: TCosmeticBag
  isLiked: boolean
  isFetchingCosmeticBags: boolean
  handleShare: () => void
  handleUnlike: (id: string) => void
}

const CosmeticBag = ({
  cosmeticBag,
  isLiked,
  isFetchingCosmeticBags,
  handleShare,
  handleUnlike,
}: TCosmeticBagProps) => {
  const { t } = useTranslation()

  return (
    <div
      key={cosmeticBag.id}
      className="flex flex-col items-center justify-center gap-2 w-full shadow-md rounded-md p-4 bg-gray-100"
    >
      <span className="w-full flex items-center justify-between">
        <Link
          to={"/cosmetic-bag/" + cosmeticBag.id}
          className="text-sm font-bold text-black"
        >
          {cosmeticBag.name || t("my-cosmetic-bags")}
        </Link>
        <div className="flex items-center gap-2">
          {isLiked && !isFetchingCosmeticBags && (
            <Button
              onClick={() => handleUnlike(String(cosmeticBag.id))}
              variant="ghost"
              size="icon"
              className={cn("rounded-full hover:bg-accent")}
            >
              <Heart fill="red" stroke="red" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handleShare}
          >
            <Share2Icon />
          </Button>
        </div>
      </span>
    </div>
  )
}

export default memo(CosmeticBag)
