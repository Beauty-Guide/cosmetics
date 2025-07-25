import { Button } from "@/components/ui/button"
import { Share2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

const CosmeticBag = () => {
  const { t } = useTranslation()
  const handleShare = () => {}

  return (
    <main className="flex flex-col items-center justify-center w-full h-full my-2 max-md:px-sides">
      <h1 className="text-xl font-bold text-black my-4 mr-auto">
        {t("my-cosmetic-bags")}
      </h1>

      <div className="flex flex-col gap-4 items-center justify-start max-md:justify-center w-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full shadow-md rounded-md p-4 bg-gray-100">
          <span className="w-full flex items-center justify-between">
            <Link to="/cosmetic-bag/1" className="text-sm font-bold text-black">
              {t("my-cosmetic-bags")}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={handleShare}
            >
              <Share2Icon />
            </Button>
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-full shadow-md rounded-md p-4 bg-gray-100">
          <span className="w-full flex items-center justify-between">
            <Link to="/cosmetic-bag/2" className="text-sm font-bold text-black">
              {t("my-cosmetic-bags")}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={handleShare}
            >
              <Share2Icon />
            </Button>
          </span>
        </div>
      </div>
    </main>
  )
}

export default CosmeticBag
