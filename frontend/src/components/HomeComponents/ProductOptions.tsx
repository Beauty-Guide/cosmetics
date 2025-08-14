import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { EllipsisIcon } from "lucide-react"
import FavoriteButton from "./FavoriteButton"
import AddProductToCosmeticBagModal from "../cosmeticBagComponents/modals/AddProductToCosmeticBagModal"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"

type Props = {
  productId: string
  prodactName: string
  additionalOptions?: React.ReactNode
}

const ProductOptions = ({
  productId,
  prodactName,
  additionalOptions,
}: Props) => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const btnOptions = useMemo(() => {
    return (
      <div className="flex flex-col gap-2 justify-center items-start max-md:p-sides mr-auto">
        <FavoriteButton productId={productId} label={t("product.add_to_fav")} />
        <AddProductToCosmeticBagModal
          cosmeticId={productId}
          label={t("cosmeticBag-add-product")}
        />
        {additionalOptions}
      </div>
    )
  }, [productId, t, additionalOptions])

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="rounded-md max-md:hidden w-8 h-8"
            size="default"
            variant="ghost"
          >
            <EllipsisIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2" aria-describedby={undefined}>
          {btnOptions}
        </PopoverContent>
      </Popover>

      {/* // mobile */}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger className="rounded-full max-md:block hidden">
          <EllipsisIcon />
        </DrawerTrigger>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle>{prodactName}</DrawerTitle>
          </DrawerHeader>
          {btnOptions}
          <DrawerFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              {t("close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ProductOptions
