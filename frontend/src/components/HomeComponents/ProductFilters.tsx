import { useEffect, useState } from "react"
import FilterCombobox from "./FilterCombobox"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { useLocation, useSearchParams } from "react-router"

const categories = [
  { name: "Уход за кожей", id: "1" },
  { name: "Кремы", id: "2" },
  { name: "Маски", id: "3" },
]

const ProductFilters = () => {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  )
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    searchParams.getAll("skinType")
  )
  const { data: brands, isLoading: isLoadingBrands } = useGetAllBrands()
  const { data: skinTypes, isLoading: isLoadingSkinTypes } = useGetAllSkinType()

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
    setSelectedCategories(searchParams.getAll("category"))
    setSelectedSkinTypes(searchParams.getAll("skinType"))
  }, [pathname, searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    selectedBrands.forEach((b) => params.append("brand", b))
    selectedCategories.forEach((c) => params.append("category", c))
    selectedSkinTypes.forEach((s) => params.append("skinType", s))

    setSearchParams(params, { replace: false })
  }, [selectedBrands, selectedCategories, selectedSkinTypes, setSearchParams])

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
