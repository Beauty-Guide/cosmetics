import { useCosmeticBags } from "@/hooks/cosmetic-bag/useCosmeticBags"
import { useToggleCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { useTranslation } from "react-i18next"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"
import { useToggleLikeCosmeticBag } from "@/hooks/cosmetic-bag/useToggleLikeCosmeticBag"
import { toast } from "sonner"
import CosmeticBag from "@/components/cosmeticBagComponents/CosmeticBag"
import CreateCosmeticBagModal from "@/components/cosmeticBagComponents/modals/CreateCosmeticBagModal"

const UserCosmeticBags = () => {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const {
    data: cosmeticBags,
    isLoading: isLoadingCosmeticBags,
    isRefetching: isRefetchingCosmeticBags,
    refetch,
  } = useCosmeticBags({ liked: isLiked })
  const { mutate: toggleCosmeticBag } = useToggleCosmeticBag()
  const { mutate: toggleLikeCosmeticBag } = useToggleLikeCosmeticBag()

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(window.location.href + `/${id}`)
    toast.success(t("product.linkCopied"))
  }

  const handleCreateCosmeticBag = ({ name }: { name: string }) => {
    toggleCosmeticBag({ name, action: "add" })
  }

  const handleUnlike = (id: string) => {
    toggleLikeCosmeticBag({ id: String(id), action: "unlike" })
  }

  useEffect(() => {
    refetch()
  }, [isLiked, refetch])

  if (isLoadingCosmeticBags) return <div>Loading...</div>

  return (
    <main className="flex flex-col items-center justify-center w-full h-full my-2 max-md:px-sides max-md:mb-20">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-black my-4 mr-auto">
          {t("my-cosmetic-bags")}
        </h1>
        <CreateCosmeticBagModal
          handleCreateCosmeticBag={handleCreateCosmeticBag}
        />
      </div>
      <ToggleGroup
        type="single"
        className="w-full p-2"
        value={isLiked ? "likedCosmeticBags" : "myCosmeticBags"}
      >
        <ToggleGroupItem
          value="myCosmeticBags"
          className="p-2"
          onClick={() => setIsLiked(false)}
        >
          {t("cosmeticBag-my-cosmetic-bags")}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="likedCosmeticBags"
          className="p-2"
          onClick={() => setIsLiked(true)}
        >
          {t("cosmeticBag-liked-cosmetic-bags")}
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex flex-col gap-4 items-center justify-start max-md:justify-center w-full h-full">
        {cosmeticBags?.map((bag) => (
          <CosmeticBag
            key={bag.id}
            cosmeticBag={bag}
            isLiked={isLiked}
            handleShare={handleShare}
            handleUnlike={handleUnlike}
            isFetchingCosmeticBags={isRefetchingCosmeticBags}
          />
        ))}
      </div>
    </main>
  )
}

export default UserCosmeticBags
