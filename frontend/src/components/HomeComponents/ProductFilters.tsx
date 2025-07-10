import { useGetAllAction } from "@/hooks/getAllAction"
import FilterCombobox from "./FilterCombobox"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { memo } from "react"
import { Skeleton } from "../ui/skeleton"
import { useTranslation } from "react-i18next"

type TProductFiltersProps = {
  selectedBrands: string[]
  selectedSkinTypes: string[]
  selectedAction: string[]
  selectedSortBy: string[]
  setSelectedBrands: (brands: string[]) => void
  setSelectedSkinTypes: (skinTypes: string[]) => void
  setSelectedAction: (actions: string[]) => void
  setSelectedSortBy: (actions: string[]) => void
}

const ProductFilters = ({
  selectedBrands,
  selectedSkinTypes,
  selectedAction,
  selectedSortBy,
  setSelectedBrands,
  setSelectedSkinTypes,
  setSelectedAction,
  setSelectedSortBy,
}: TProductFiltersProps) => {
  const { t } = useTranslation()
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()
  const { data: skinTypes, isLoading: isLoadingSkinTypes } = useGetAllSkinType()
  const { data: actions, isLoading: isLoadingActions } = useGetAllAction()
  const sortByOptions = [
    { name: "По дате", id: "byDate" },
    { name: "По популярности", id: "byPopularity" },
    { name: "По избранному", id: "byFavourite" },
  ]

  if (isLoadingBrands || isLoadingSkinTypes || isLoadingActions) {
    return (
      <div className="w-full">
        <Skeleton className="h-[100px] w-full rounded-xl p-4 my-5" />
      </div>
    )
  }

  return (
    <div className="flex py-5 w-full">
      <div className="flex gap-5 overflow-x-auto p-3 shadow-md rounded-md">
        <FilterCombobox
          label={t("filter.select_brand")}
          options={brands}
          values={selectedBrands}
          onChange={setSelectedBrands}
          labels={false}
          className="max-md:max-w-[150px]"
        />
        <FilterCombobox
          label={t("filter.select_skin_type")}
          options={skinTypes}
          values={selectedSkinTypes}
          onChange={setSelectedSkinTypes}
          labels={false}
          className="max-md:max-w-[150px]"
        />
        <FilterCombobox
          label={t("filter.select_action")}
          options={actions}
          values={selectedAction}
          onChange={setSelectedAction}
          labels={false}
          className="max-md:max-w-[150px]"
        />
        <FilterCombobox
          label="Топ 10"
          options={sortByOptions}
          values={selectedSortBy}
          onChange={setSelectedSortBy}
          labels={false}
          className="max-md:max-w-[150px]"
          singleSelect={true}
        />
      </div>
    </div>
  )
}

export default memo(ProductFilters)
