import { useGetAllAction } from "@/hooks/getAllAction"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { useTranslation } from "react-i18next"
import { Badge } from "../ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import type { Option } from "../HomeComponents/FilterCombobox"
import { Input } from "../ui/input"
import { memo, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

type TMobileProductFilterOption = {
  name: string
  options: Option[]
  setSelectedOptions: (options: string[]) => void
  values: string[]
  singleSelect?: boolean
  searchInput?: boolean
}

const MobileProductFilterOption = ({
  name,
  options,
  setSelectedOptions,
  values,
  singleSelect = false,
  searchInput = true,
}: TMobileProductFilterOption) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState<string>("")

  const toggleValue = (value: string) => {
    if (singleSelect) {
      if (values.includes(value)) {
        setSelectedOptions([])
      } else {
        setSelectedOptions([value])
      }
    } else {
      if (values.includes(value)) {
        setSelectedOptions(values.filter((v) => v !== value))
      } else {
        setSelectedOptions([...values, value])
      }
    }
  }

  const sortedOptions = useMemo(() => {
    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    const selectedOptions = filtered.filter((option) =>
      values.includes(String(option.id))
    )
    const unselectedOptions = filtered.filter(
      (option) => !values.includes(String(option.id))
    )

    return [...selectedOptions, ...unselectedOptions]
  }, [options, searchValue, values])

  return (
    <Dialog>
      <DialogTrigger>
        <Badge
          className={cn(
            "px-2 py-1 bg-white text-black border border-gray-300",
            values.length > 0 && "bg-gray-100 border-gray-500"
          )}
        >
          {values.length > 0 && `${values.length} `}
          {name}
        </Badge>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="flex flex-col gap-12 max-w-none max-h-none h-full"
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div tabIndex={0} className="sr-only" />
        {searchInput && (
          <Input
            placeholder={t("search")}
            className={"max-w-[550px] border-r-0"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
        <div className="flex items-center justify-start flex-wrap gap-2 max-h-[400px] overflow-y-auto">
          {sortedOptions.map((option) => (
            <Badge
              onClick={() => toggleValue(String(option.id))}
              key={option.id}
              className={cn(
                "h-8 px-2 py-1 bg-white text-black border border-gray-300",
                values.some((v) => String(v) === String(option.id)) &&
                  "bg-gray-100 border-gray-500"
              )}
            >
              {option.name}
            </Badge>
          ))}
        </div>
        <DialogClose asChild>
          <Button variant="outline">{t("close")}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

type TMobileProductFilters = {
  selectedBrands: string[]
  selectedSkinTypes: string[]
  selectedAction: string[]
  selectedSortBy: string[]
  setSelectedBrands: (brands: string[]) => void
  setSelectedSkinTypes: (skinTypes: string[]) => void
  setSelectedAction: (actions: string[]) => void
  setSelectedSortBy: (actions: string[]) => void
}

const MobileProductFilters = ({
  selectedBrands,
  selectedSkinTypes,
  selectedAction,
  selectedSortBy,
  setSelectedBrands,
  setSelectedSkinTypes,
  setSelectedAction,
  setSelectedSortBy,
}: TMobileProductFilters) => {
  const { t } = useTranslation()
  const { data: brands } = useGetAllBrands()
  const { data: skinTypes } = useGetAllSkinType()
  const { data: actions } = useGetAllAction()
  const sortByOptions = [
    { name: t("fliter.sort_by_date"), id: "byDate" },
    { name: t("filter.sort_by_popularity"), id: "byPopularity" },
    { name: t("filter.sort_by_favorites"), id: "byFavourite" },
  ]

  return (
    <div className="flex flex-wrap gap-2 py-4">
      <MobileProductFilterOption
        name={t("filter.select_brand")}
        options={brands || []}
        setSelectedOptions={setSelectedBrands}
        values={selectedBrands}
      />
      <MobileProductFilterOption
        name={t("filter.select_skin_type")}
        options={skinTypes || []}
        setSelectedOptions={setSelectedSkinTypes}
        values={selectedSkinTypes}
      />
      <MobileProductFilterOption
        name={t("filter.select_action")}
        options={actions || []}
        setSelectedOptions={setSelectedAction}
        values={selectedAction}
      />
      <MobileProductFilterOption
        name={t("filter.sort_by")}
        options={sortByOptions}
        setSelectedOptions={setSelectedSortBy}
        values={selectedSortBy}
        searchInput={false}
        singleSelect={true}
      />
    </div>
  )
}

export default memo(MobileProductFilters)
