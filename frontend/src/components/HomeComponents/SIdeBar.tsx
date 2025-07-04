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

type SideBarProps = {
  categoryTree: TCategory[]
}

const SideBar = ({ categoryTree }: SideBarProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 w-[300px] max-md:hidden mt-5">
        <h1 className="text-3xl text-blue-500 font-bold">Категории</h1>
        <div>
          {categoryTree.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </div>
      </div>
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Категории</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Категории</DrawerTitle>
              </DrawerHeader>
              <div>
                {categoryTree.map((cat) => (
                  <CategoryItem key={cat.id} category={cat} />
                ))}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Закрыть</Button>
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
