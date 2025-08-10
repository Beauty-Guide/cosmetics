import type { TCosmeticBag } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

type Props = {
  values: TCosmeticBag[]
  handleApply: (bags: TCosmeticBag[]) => void
}

const CosmeticBagSelect = ({ values, handleApply }: Props) => {
  const { t } = useTranslation()
  const [selectedCosmeticBags, setSelectedCosmeticBags] = useState(values)

  const onSelectChange = (checked: boolean, id: string) => {
    const product = selectedCosmeticBags.find((bag) => bag.id === id)
    if (!product) return

    setSelectedCosmeticBags((prev) =>
      prev.map((bag) =>
        bag.id === id ? { ...bag, hasCosmetic: checked } : bag
      )
    )
  }

  return (
    <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
      {selectedCosmeticBags.map((bag) => (
        <div
          key={bag.id}
          className={cn(
            "flex items-center gap-3 shadow-md p-2 rounded-md",
            bag.hasCosmetic && "bg-gray-100"
          )}
        >
          <Checkbox
            id={bag.id}
            checked={bag.hasCosmetic}
            onCheckedChange={(checked) =>
              onSelectChange(checked as boolean, bag.id)
            }
          />
          <label htmlFor={bag.id} className="break-all">
            {bag.name + ` (${bag.cosmetics.length})`}
          </label>
        </div>
      ))}
      <Button
        variant="outline"
        form="search-form"
        className="mt-3"
        onClick={() => handleApply(selectedCosmeticBags)}
      >
        {t("apply")}
      </Button>
    </div>
  )
}

export default CosmeticBagSelect
