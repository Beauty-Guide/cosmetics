import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer"
import CategoryItem from "../HomeComponents/CategoryItem"
import { Button } from "../ui/button"
import type { TCategory } from "@/types"
import { useTranslation } from "react-i18next"

type TSideBarProps = {
  categoryTree: TCategory[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const MobileCatalogModal = ({
  categoryTree,
  isOpen,
  setIsOpen,
}: TSideBarProps) => {
  const { t } = useTranslation()

  return (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent aria-describedby={undefined}>
          <div className="mx-auto w-full max-w-sm overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="text-gray-800">
                {t("categories")}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col">
              {categoryTree.map((cat) => (
                <CategoryItem key={cat.id} category={cat} />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default MobileCatalogModal
