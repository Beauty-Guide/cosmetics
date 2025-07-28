import { useCosmeticBags } from "@/hooks/cosmetic-bag/useCosmeticBags"
import { useCreateCosmeticBag } from "@/hooks/cosmetic-bag/useToggleCosmeticBags"
import { useTranslation } from "react-i18next"
import CosmeticBag from "@/components/cosmeticBagComponents/CosmeticBag"
import CreateCosmeticBugModal from "@/components/cosmeticBagComponents/modals/CreateCosmeticBugModal"

const UserCosmeticBags = () => {
  const { t } = useTranslation()
  const { data: cosmeticBags, isLoading: isLoadingCosmeticBags } =
    useCosmeticBags({ liked: false })
  const { mutate: createCosmeticBag } = useCreateCosmeticBag()

  const handleShare = () => {}

  const handleCreateCosmeticBag = ({ name }: { name: string }) => {
    createCosmeticBag({ name })
  }

  if (isLoadingCosmeticBags) return <div>Loading...</div>

  return (
    <main className="flex flex-col items-center justify-center w-full h-full my-2 max-md:px-sides">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-black my-4 mr-auto">
          {t("my-cosmetic-bags")}
        </h1>
        <CreateCosmeticBugModal
          handleCreateCosmeticBag={handleCreateCosmeticBag}
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-start max-md:justify-center w-full">
        {cosmeticBags?.map((bag) => (
          <CosmeticBag
            key={bag.id}
            cosmeticBag={bag}
            handleShare={handleShare}
          />
        ))}
      </div>
    </main>
  )
}

export default UserCosmeticBags
