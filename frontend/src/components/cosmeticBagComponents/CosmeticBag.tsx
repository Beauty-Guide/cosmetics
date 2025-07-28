import type { TCosmeticBag } from "@/types"
import { Link } from "react-router"
import { Button } from "../ui/button"
import { Share2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"

type TCosmeticBagProps = {
  cosmeticBag: TCosmeticBag
  handleShare: () => void
}

const CosmeticBag = ({ cosmeticBag, handleShare }: TCosmeticBagProps) => {
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
        <Button variant="ghost" size="icon" className="" onClick={handleShare}>
          <Share2Icon />
        </Button>
      </span>
    </div>
  )
}

export default CosmeticBag
