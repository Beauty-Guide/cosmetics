import { Button } from "@/components/ui/button"
import { useCosmeticBag } from "@/hooks/cosmetic-bag/useCosmeticBag"
import { useToggleCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router"

const CosmeticBugItems = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: cosmeticBag, isLoading } = useCosmeticBag(id || "")
  const { mutate: toggleCosmeticBag } = useToggleCosmeticBag()

  const handleDeleteCosmeticBag = () => {
    if (!cosmeticBag || !id) return
    toggleCosmeticBag({ action: "remove", name: cosmeticBag?.name, id: id })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <main className="flex flex-col items-center justify-center gap-2 w-full h-full max-md:px-sides max-md:mb-15">
      <h1 className="text-2xl font-semibold mr-auto p-2">
        {cosmeticBag?.name || t("cosmetic-bag")}
      </h1>
      <div className="flex flex-col items-start justify-center border shadow-md rounded-md w-full">
        <div className="flex flex-col">
          {cosmeticBag?.cosmetics ? (
            cosmeticBag.cosmetics.map((cosmetic) => (
              <div key={cosmetic.id} className="p-3">
                <Link to={"/product/" + cosmetic.id} className="text-left p-2">
                  {cosmetic.name}
                </Link>
              </div>
            ))
          ) : (
            <div>
              <h1>{t("empty-cosmetic-bag")}</h1>
            </div>
          )}
        </div>
      </div>
      <Button onClick={handleDeleteCosmeticBag} className="m-2">
        Удалить коллекцию
      </Button>
    </main>
  )
}

export default CosmeticBugItems
