import { useGetAllAction } from "@/hooks/getAllAction"
import FilterCombobox from "./FilterCombobox"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { memo } from "react"
import { Skeleton } from "../ui/skeleton"

type TProductFiltersProps = {
  selectedBrands: string[]
  selectedSkinTypes: string[]
  selectedAction: string[]
  setSelectedBrands: (brands: string[]) => void
  setSelectedSkinTypes: (skinTypes: string[]) => void
  setSelectedAction: (actions: string[]) => void
}

const ProductFilters = ({
  selectedBrands,
  selectedSkinTypes,
  selectedAction,
  setSelectedBrands,
  setSelectedSkinTypes,
  setSelectedAction,
}: TProductFiltersProps) => {
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()
  const { data: skinTypes, isLoading: isLoadingSkinTypes } = useGetAllSkinType()
  const { data: actions, isLoading: isLoadingActions } = useGetAllAction()

  if (isLoadingBrands || isLoadingSkinTypes || isLoadingActions) {
    return (
      <div className="w-full">
        <Skeleton className="h-[100px] w-full rounded-xl p-4 my-5" />
      </div>
    )
  }

  return (
    <div className="flex py-5 w-full">
      <div className="flex gap-5 max-md:flex-wrap p-3 shadow-xl rounded-xl">
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
        <FilterCombobox
          label="Действие"
          options={actions}
          values={selectedAction}
          onChange={setSelectedAction}
        />
      </div>
    </div>
  )
}

export default memo(ProductFilters)
