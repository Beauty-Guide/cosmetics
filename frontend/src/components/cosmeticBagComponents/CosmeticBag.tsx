import type { TCosmeticBag } from "@/types"
import { Link, useNavigate } from "react-router"
import { Button } from "../ui/button"
import { Heart, Share2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { memo } from "react"
import { cn } from "@/lib/utils"

type TCosmeticBagProps = {
  cosmeticBag: TCosmeticBag
  isLiked: boolean
  isFetchingCosmeticBags: boolean
  handleShare: (id: string) => void
  handleUnlike: (id: string) => void
}

const CosmeticBag = ({
  cosmeticBag,
  isLiked,
  isFetchingCosmeticBags,
  handleShare,
  handleUnlike,
}: TCosmeticBagProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div
      onClick={() => navigate("/cosmetic-bag/" + cosmeticBag.id)}
      key={cosmeticBag.id}
      className="flex flex-col items-center justify-center gap-2 w-full shadow-md rounded-md p-4 bg-gray-100 cursor-pointer"
    >
      <span className="w-full flex items-center justify-between">
        <Link
          to={"/cosmetic-bag/" + cosmeticBag.id}
          className="text-sm font-bold text-black"
        >
          {cosmeticBag.name || t("my-cosmetic-bags")}
        </Link>
        <div className="flex items-center gap-2">
          {cosmeticBag.likes > 0 && (
            <span className="flex items-center justify-center">
              <p className="z-20 text-center">{cosmeticBag.likes}</p>
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
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="z-40"
            onClick={(e) => {
              e.stopPropagation()
              handleShare(String(cosmeticBag.id))
            }}
          >
            <Share2Icon />
          </Button>
        </div>
      </span>
    </div>
  )
}

export default memo(CosmeticBag)
