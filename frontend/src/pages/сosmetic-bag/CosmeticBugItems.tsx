import EditName from "@/components/cosmeticBagComponents/EditName"
import { Button } from "@/components/ui/button"
import { useCosmeticBag } from "@/hooks/cosmetic-bag/useCosmeticBag"
import { useToggleCosmeticBagProduct } from "@/hooks/cosmetic-bag/useToggleCosmeticBagProduct"
import { useToggleCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router"

const CosmeticBugItems = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: cosmeticBagRes, isLoading } = useCosmeticBag(id || "")
  const { mutate: toggleCosmeticBag } = useToggleCosmeticBag()
  const { mutate: toggleCosmeticBagProduct } = useToggleCosmeticBagProduct()

  const handleDeleteCosmeticBag = () => {
    if (!cosmeticBagRes || !id) return
    const confirmed = window.confirm(t("cosmeticBag-delete-confirm"))
    if (confirmed)
      toggleCosmeticBag({
        action: "remove",
        name: cosmeticBagRes?.cosmeticBag.name,
        id: id,
      })
  }

  const onSaveEdit = (newName: string) => {
    toggleCosmeticBag({ action: "update", name: newName, id: id })
  }

  const handleDeleteItem = (cosmeticId: string) => {
    if (!cosmeticBagRes || !id) return
    const confirmed = window.confirm(t("cosmeticBag-delete-item-confirm"))
    if (confirmed)
      toggleCosmeticBagProduct({ action: "remove", bagId: id, cosmeticId })
  }

  if (isLoading) return <div>Loading...</div>
  if (!cosmeticBagRes) return <div>Bag not found</div>

  return (
    <main className="flex flex-col items-center justify-center gap-2 w-full h-full max-md:px-sides max-md:mb-15">
      <div className="flex items-center justify-between w-full flex-wrap my-2">
        <EditName
          name={cosmeticBagRes?.cosmeticBag.name}
          isOwner={cosmeticBagRes.owner}
          onSaveEditName={onSaveEdit}
        />
        {cosmeticBagRes.cosmeticBag.likes > 0 && (
          <div className="flex items-center gap-1">
            <span>{t("cosmeticBag-likes")}:</span>
            <span className="font-bold">
              {cosmeticBagRes.cosmeticBag.likes}
            </span>
          </div>
        )}
        {cosmeticBagRes.owner && (
          <Button onClick={handleDeleteCosmeticBag} className="my-2">
            {t("cosmeticBag-delete")}
          </Button>
        )}
      </div>
      <div className="flex flex-col items-start justify-center border shadow-md rounded-md w-full">
        <div className="flex flex-col w-full">
          {cosmeticBagRes?.cosmeticBag.cosmetics ? (
            cosmeticBagRes.cosmeticBag.cosmetics.map((cosmetic) => (
              <div
                key={cosmetic.id}
                className="flex items-center justify-between p-3 w-full"
              >
                <Link to={"/product/" + cosmetic.id} className="text-left p-2">
                  {cosmetic.name}
                </Link>
                {cosmeticBagRes.owner && (
                  <Button
                    className="rounded-full"
                    size="icon"
                    variant="outline"
                    onClick={() => handleDeleteItem(String(cosmetic.id))}
                  >
                    <Trash2Icon />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <h1 className="text-xl p-2 font-semibold">
                {t("empty-cosmetic-bag")}
              </h1>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default CosmeticBugItems
