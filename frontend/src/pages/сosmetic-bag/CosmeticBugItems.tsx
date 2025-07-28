import { useCosmeticBag } from "@/hooks/cosmetic-bag/useCosmeticBag"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"

const CosmeticBugItems = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: cosmeticBag } = useCosmeticBag(id || "")

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-start justify-center border shadow-md rounded-md p-3 mt-5 w-full">
        <h1 className="text-left p-2">{t("cosmetic-bag")}</h1>
        <div className="flex flex-col">
          <h1>{cosmeticBag?.name}</h1>
          <p>{cosmeticBag?.createdAt}</p>
        </div>
      </div>
    </main>
  )
}

export default CosmeticBugItems
