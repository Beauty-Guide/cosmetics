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

type Props = {
  productId: string
  prodactName: string
}

const ProductOptions = ({ productId, prodactName }: Props) => {
  const { t } = useTranslation()
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
        <PopoverContent className="w-fit" aria-describedby={undefined}>
          <div className="flex flex-col gap-2 justify-center items-start">
            <FavoriteButton
              productId={productId}
              label={t("product.add_to_fav")}
            />
            <AddProductToCosmeticBagModal
              cosmeticId={productId}
              label={t("cosmeticBag-add-product")}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* // mobile */}

      <Drawer>
        <DrawerTrigger className="rounded-full max-md:block hidden">
          <EllipsisIcon />
        </DrawerTrigger>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle>{prodactName}</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 justify-center items-start p-sides mr-auto">
            <FavoriteButton
              productId={productId}
              label={t("product.add_to_fav")}
            />
            <AddProductToCosmeticBagModal
              cosmeticId={productId}
              label={t("cosmeticBag-add-product")}
            />
          </div>
          <DrawerFooter>
            <Button variant="outline" className="w-full">
              {t("close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ProductOptions
