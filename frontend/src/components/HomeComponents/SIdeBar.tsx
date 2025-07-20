import type { TCategory } from "@/types"
import CategoryItem from "./CategoryItem"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

type SideBarProps = {
  categoryTree: TCategory[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SideBar = ({ categoryTree, isOpen, setIsOpen }: SideBarProps) => {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex flex-col gap-4 w-[300px] max-md:hidden">
        <h1 className="text-3xl text-blue-900 font-bold">{t("categories")}</h1>
        <div>
          {categoryTree.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </div>
      </div>
      <div className="md:hidden">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent aria-describedby={undefined}>
            <div className="mx-auto w-full max-w-sm overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>{t("categories")}</DrawerTitle>
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
    </>
  )
}

export default SideBar
