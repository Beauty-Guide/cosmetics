import CosmeticBagLikeBtn from "@/components/cosmeticBagComponents/CosmeticBagLikeBtn"
import EditName from "@/components/cosmeticBagComponents/EditName"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import { useCosmeticBag } from "@/hooks/cosmetic-bag/useCosmeticBag"
import { useToggleCosmeticBagProduct } from "@/hooks/cosmetic-bag/useToggleCosmeticBagProduct"
import { useToggleCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router"

const CosmeticBugItems = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const user = useAuth()
  const isAdmin = user?.role?.includes(ROLES.ADMIN)
  const isUser = user?.role?.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser
  const { data: cosmeticBag, isLoading } = useCosmeticBag(id || "")
  const { mutate: toggleCosmeticBag } = useToggleCosmeticBag()
  const { mutate: toggleCosmeticBagProduct } = useToggleCosmeticBagProduct()

  const handleDeleteCosmeticBag = () => {
    if (!cosmeticBag || !id) return
    const confirmed = window.confirm(t("cosmeticBag-delete-confirm"))
    if (confirmed)
      toggleCosmeticBag({ action: "remove", name: cosmeticBag?.name, id: id })
  }

  const onSaveEdit = (newName: string) => {
    toggleCosmeticBag({ action: "update", name: newName, id: id })
  }

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
      <div className="flex items-center justify-between w-full flex-wrap my-2">
        <EditName name={cosmeticBag?.name} onSaveEditName={onSaveEdit} />
        <Button onClick={handleDeleteCosmeticBag} className="my-2">
          {t("cosmeticBag-delete")}
        </Button>
        <CosmeticBagLikeBtn isLiked={isAuthenticated || false} />
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
