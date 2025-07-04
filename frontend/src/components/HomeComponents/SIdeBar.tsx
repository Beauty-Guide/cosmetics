import type { TCategory } from "@/types"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/accordion"
// import CategoryItem from "./CategoryItem"
import CategoryAccordion from "./CategoryAccordion"

type SideBarProps = {
  categoryTree: TCategory[]
}

const SideBar = ({ categoryTree }: SideBarProps) => {
  console.log(categoryTree)

  return (
    <div className="flex flex-col gap-4 w-[500px]">
      <h1 className="text-3xl text-blue-500">Категории</h1>
      <div>
        {/* {categoryTree.map((cat) => (
          <CategoryItem key={cat.id} category={cat} />
        ))} */}
        <CategoryAccordion categories={categoryTree} />
      </div>
      {/* <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h1>Уход за кожей</h1>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            Уход для лица
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <h1>Макияж</h1>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance"></AccordionContent>
        </AccordionItem>
      </Accordion> */}
    </div>
  )
}

export default SideBar
