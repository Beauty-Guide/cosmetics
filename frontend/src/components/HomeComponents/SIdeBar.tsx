import type { TCategory } from "@/types"
import CategoryItem from "./CategoryItem"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"
import { List } from "lucide-react"

type SideBarProps = {
  categoryTree: TCategory[]
}

const SideBar = ({ categoryTree }: SideBarProps) => {
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
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="my-2">
              <List />
            </Button>
          </DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{t("categories")}</DrawerTitle>
              </DrawerHeader>
              <div>
                {categoryTree.map((cat) => (
                  <CategoryItem key={cat.id} category={cat} />
                ))}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">{t("close")}</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}

export default SideBar
