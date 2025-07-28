import { Button } from "@/components/ui/button"
import { useCosmeticBag } from "@/hooks/cosmetic-bag/useCosmeticBag"
import { useToggleCosmeticBagProduct } from "@/hooks/cosmetic-bag/useToggleCosmeticBagProduct"
import { useToggleCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { Edit2Icon, Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router"

const CosmeticBugItems = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: cosmeticBag, isLoading } = useCosmeticBag(id || "")
  const { mutate: toggleCosmeticBag } = useToggleCosmeticBag()
  const { mutate: toggleCosmeticBagProduct } = useToggleCosmeticBagProduct()

  const handleDeleteCosmeticBag = () => {
    if (!cosmeticBag || !id) return
    const confirmed = window.confirm(t("cosmeticBag-delete-confirm"))
    if (confirmed)
      toggleCosmeticBag({ action: "remove", name: cosmeticBag?.name, id: id })
  }

  const handleEdit = () => {}

  const handleDeleteItem = (cosmeticId: string) => {
    if (!cosmeticBag || !id) return
    const confirmed = window.confirm(t("cosmeticBag-delete-item-confirm"))
    if (confirmed)
      toggleCosmeticBagProduct({ action: "remove", bagId: id, cosmeticId })
  }

  if (isLoading) return <div>Loading...</div>
  if (!cosmeticBag) return <div>Bag not found</div>

  return (
    <main className="flex flex-col items-center justify-center gap-2 w-full h-full max-md:px-sides max-md:mb-15">
      <div className="flex items-center justify-between w-full my-2">
        <h1 className="text-2xl font-semibold mr-auto p-2">
          {cosmeticBag?.name || t("cosmetic-bag")}
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleEdit}
        >
          <Edit2Icon />
        </Button>
        <Button onClick={handleDeleteCosmeticBag} className="m-2">
          {t("cosmeticBag-delete")}
        </Button>
      </div>
      <div className="flex flex-col items-start justify-center border shadow-md rounded-md w-full">
        <div className="flex flex-col w-full">
          {cosmeticBag?.cosmetics ? (
            cosmeticBag.cosmetics.map((cosmetic) => (
              <div
                key={cosmetic.id}
                className="flex items-center justify-between p-3 w-full"
              >
                <Link to={"/product/" + cosmetic.id} className="text-left p-2">
                  {cosmetic.name}
                </Link>
                <Button
                  className="rounded-full"
                  size="icon"
                  variant="outline"
                  onClick={() => handleDeleteItem(String(cosmetic.id))}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))
          ) : (
            <div>
              <h1>{t("empty-cosmetic-bag")}</h1>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default CosmeticBugItems
