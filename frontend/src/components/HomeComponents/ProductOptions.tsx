import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { EllipsisIcon } from "lucide-react"
import FavoriteButton from "./FavoriteButton"
import AddProductToCosmeticBagModal from "../cosmeticBagComponents/modals/AddProductToCosmeticBagModal"
import { useTranslation } from "react-i18next"

type Props = {
  productId: string
}

const ProductOptions = ({ productId }: Props) => {
  const { t } = useTranslation()
  return (
    <Drawer>
      <DrawerTrigger className="rounded-full">
        <EllipsisIcon />
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-2 justify-start p-sides">
          <FavoriteButton productId={productId} label="Добавить в избранное" />
          <AddProductToCosmeticBagModal
            cosmeticId={productId}
            label="Добавить в косметичку"
          />
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              {t("close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ProductOptions
