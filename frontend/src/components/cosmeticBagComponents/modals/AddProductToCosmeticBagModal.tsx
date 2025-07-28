import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCosmeticBags } from "@/hooks/cosmetic-bag/useCosmeticBags"
import { ShoppingBasketIcon } from "lucide-react"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useToggleCosmeticBagProduct } from "@/hooks/cosmetic-bag/useToggleCosmeticBagProduct"
import { Skeleton } from "@/components/ui/skeleton"

type TAddProductToCosmeticBagModalProps = {
  cosmeticId: string
}

const AddProductToCosmeticBagModal = ({
  cosmeticId,
}: TAddProductToCosmeticBagModalProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedCosmeticBag, setSelectedCosmeticBag] = useState<string>("")

  const { data: cosmeticBags, isLoading: isLoadingCosmeticBags } =
    useCosmeticBags({ liked: false, cosmeticId: cosmeticId })
  const { mutate: toggleCosmeticBagProduct } = useToggleCosmeticBagProduct()

  const handleAdd = () => {
    if (!selectedCosmeticBag) {
      toast.error("Выберите коллекцию")
      return
    }
    toggleCosmeticBagProduct({
      bagId: selectedCosmeticBag,
      action: "add",
      cosmeticId: cosmeticId,
    })
    setIsOpen(false)
    setSelectedCosmeticBag("")
  }

  if (isLoadingCosmeticBags) return <Skeleton className="w-6 h-6" />

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-black rounded-full" size="icon">
          <ShoppingBasketIcon />
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
          <Select onValueChange={setSelectedCosmeticBag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={t("cosmeticBag-select-my-cosmetic-bags")}
              />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectLabel>{t("cosmeticBag-my-cosmetic-bags")}</SelectLabel>
                {cosmeticBags &&
                  cosmeticBags.map((cosmeticBag) => (
                    <SelectItem key={cosmeticBag.id} value={cosmeticBag.id}>
                      {cosmeticBag.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="w-full flex items-center">
          <Button variant="outline" form="search-form" onClick={handleAdd}>
            {t("cosmeticBag-add-product")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default memo(AddProductToCosmeticBagModal)
