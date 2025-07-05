import FilterCombobox from "./FilterCombobox"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { memo } from "react"

type TProductFiltersProps = {
  selectedBrands: string[]
  selectedSkinTypes: string[]
  setSelectedBrands: (brands: string[]) => void
  setSelectedSkinTypes: (skinTypes: string[]) => void
}

const ProductFilters = ({
  selectedBrands,
  selectedSkinTypes,
  setSelectedBrands,
  setSelectedSkinTypes,
}: TProductFiltersProps) => {
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
          label="Тип кожи"
          options={skinTypes}
          values={selectedSkinTypes}
          onChange={setSelectedSkinTypes}
        />
      </div>
    </div>
  )
}

export default memo(ProductFilters)
