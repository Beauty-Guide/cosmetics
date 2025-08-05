import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
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
        <PopoverContent className="w-fit">
          <div className="flex flex-col gap-2 justify-center items-start">
            <FavoriteButton
              productId={productId}
              label="Добавить в избранное"
            />
            <AddProductToCosmeticBagModal
              cosmeticId={productId}
              label="Добавить в косметичку"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* // mobile */}

      <Drawer>
        <DrawerTrigger className="rounded-full max-md:block hidden">
          <EllipsisIcon />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <h2 className="text-lg font-semibold">{prodactName}</h2>
          </DrawerHeader>
          <div className="flex flex-col gap-2 justify-center items-start p-sides mr-auto">
            <FavoriteButton
              productId={productId}
              label="Добавить в избранное"
            />
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
    </>
  )
}

export default ProductOptions
