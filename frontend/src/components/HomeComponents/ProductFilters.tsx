import { useState } from "react"
import FilterCombobox from "./FilterCombobox"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"

const categories = [
  { name: "Уход за кожей", id: "skin" },
  { name: "Кремы", id: "creams" },
  { name: "Маски", id: "masks" },
]

const ProductFilters = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([])
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()
  const { data: skinTypes, isLoading: isLoadingSkinTypes } = useGetAllSkinType()

  if (isLoadingBrands || isLoadingSkinTypes) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-5 space-y-4 w-full">
      <div className="flex gap-5 flex-wrap w-full">
        <FilterCombobox
          label="Бренд"
          options={brands}
          values={selectedBrands}
          onChange={setSelectedBrands}
        />
        <FilterCombobox
          label="Категория"
          options={categories}
          values={selectedCategories}
          onChange={setSelectedCategories}
        />
        <FilterCombobox
          label="Тип кожи"
          options={skinTypes}
          values={selectedSkinTypes}
          onChange={setSelectedSkinTypes}
        />
      </div>
    </div>
  )
}

export default ProductFilters
