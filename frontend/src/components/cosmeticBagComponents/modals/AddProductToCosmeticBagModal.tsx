import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCosmeticBags } from "@/hooks/cosmetic-bag/useCosmeticBags"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import cosmeticBagIcon from "../../../assets/ui/косметичка-32.png"
import CosmeticBagSelect from "../CosmeticBagSelect"
import type { TCosmeticBag } from "@/types"
import { useCosmeticBagsBulkUpdate } from "@/hooks/cosmetic-bag/useCosmeticBagsBulkUpdate"

type TAddProductToCosmeticBagModalProps = {
  cosmeticId: string
  label?: string
}

const AddProductToCosmeticBagModal = ({
  cosmeticId,
  label,
}: TAddProductToCosmeticBagModalProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { data: cosmeticBags, isLoading: isLoadingCosmeticBags } =
    useCosmeticBags({ liked: false, cosmeticId: cosmeticId })
  const { mutate: bulkUpate } = useCosmeticBagsBulkUpdate()

  const handleApply = (bags: TCosmeticBag[]) => {
    const oldBags = new Map(cosmeticBags?.map((bag) => [bag.id, bag]))
    const hasChanged = bags.some((bag) => {
      const oldBag = oldBags.get(bag.id)
      if (!oldBag) return true
      return oldBag.hasCosmetic !== bag.hasCosmetic
    })

    if (!hasChanged) {
      setIsOpen(false)
      return
    }

    const bagsToUpdate = bags.map((bag) => ({
      id: bag.id,
      hasCosmetic: bag.hasCosmetic,
    })) as Pick<TCosmeticBag, "id" | "hasCosmetic">[]

    bulkUpate({
      data: bagsToUpdate,
      cosmeticId: cosmeticId,
    })
    setIsOpen(false)
  }

  if (isLoadingCosmeticBags) return <Skeleton className="w-fit" />

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={label ? "default" : "icon"}
          className="flex items-start justify-start rounded-full px-2.5"
        >
          <img src={cosmeticBagIcon} alt="shopping-bag" className="w-5 h-5" />
          {label && <span className="text-gray-800">{label}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-2/3 max-md:w-full max-w-none sm:max-w-full flex flex-col justify-start items-start top-[5vh] max-md:top-0 translate-y-0 gap-1 rounded-md"
      >
        <DialogHeader className="my-5 w-full">
          <DialogTitle>{t("cosmeticBag-add-product")}</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-2 my-3">
          <CosmeticBagSelect
            values={cosmeticBags || []}
            handleApply={handleApply}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(AddProductToCosmeticBagModal)
