import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function CategoryAccordion({ categories, level = 0 }) {
  console.log(level)

  return (
    <Accordion type="multiple" className="w-full">
      {categories.map((cat) => (
        <AccordionItem value={`item-${cat.id}`} key={cat.id}>
          <AccordionTrigger className={`ml-${level * 4}`}>
            {cat.name}
          </AccordionTrigger>
          <AccordionContent>
            {cat.children && cat.children.length > 0 ? (
              <CategoryAccordion categories={cat.children} level={level + 1} />
            ) : (
              <span className="text-muted-foreground pl-2 block">
                Нет подкатегорий
              </span>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
