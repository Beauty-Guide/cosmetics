import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SearchInput from "./SearhInput"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { memo, useEffect, useRef, useState } from "react"
import type { TUserHistory } from "@/types"
import { useNavigate, useSearchParams } from "react-router"
import { Button } from "./ui/button"
import { useDeleteSearchHistory } from "@/hooks/useDeleteSearhHistory"
import ProductFilters from "./HomeComponents/ProductFilters"

type TSearhInputProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  userHistory: TUserHistory[]
}

const SearchDialogModal = ({
  open,
  setOpen,
  userHistory,
}: TSearhInputProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand")
  )
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
    searchParams.getAll("skinType")
  )
  const [selectedAction, setSelectedAction] = useState<string[]>(
    searchParams.getAll("cosmeticAction")
  )
  const [sortBy, setSortBy] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<TUserHistory[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchValue = searchParams.get("search")

  const { mutate: deleteSearchHistory } = useDeleteSearchHistory()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpen(false)

    const params = new URLSearchParams()
    const searchValue = searchInputRef.current?.value.trim()

    if (searchValue && searchValue.length > 2) {
      params.append("search", searchValue)
      setSearchHistory((prev) => [
        ...prev,
        { id: prev.length + 1, searchQuery: searchValue },
      ])
    } else if (!searchValue) {
      params.delete("search")
    }

    if (selectedBrands.length > 0) {
      selectedBrands.forEach((b) => {
        params.append("brand", b)
      })
    } else {
      params.delete("brand")
    }

    if (selectedSkinTypes.length > 0) {
      selectedSkinTypes.forEach((b) => {
        params.append("skinType", b)
      })
    } else {
      params.delete("skinType")
    }

    if (selectedAction.length > 0) {
      selectedAction.forEach((b) => {
        params.append("cosmeticAction", b)
      })
    } else {
      params.delete("cosmeticAction")
    }

    if (sortBy.length > 0) {
      console.log("asd", sortBy[0])

      params.append("sortBy", sortBy[0])
    }

    setSearchParams(params, { replace: false })

    if (searchValue && searchValue.length > 2) {
      navigate(`/?${params.toString()}`)
    }
  }

  const handleSelectOption = (option: string) => {
    const params = new URLSearchParams()
    params.append("search", option)
    if (searchInputRef.current) searchInputRef.current.value = option
    setSearchParams(params, { replace: false })
  }

  const handleDeleteHistoryOption = (id: number) => {
    deleteSearchHistory(id.toString())
    if (searchInputRef.current) searchInputRef.current.value = ""
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setSelectedSkinTypes([])
    setSelectedAction([])
    setSortBy([])
  }

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand"))
  }, [searchParams])

  useEffect(() => {
    if (userHistory.length > 0) {
      setSearchHistory(userHistory)
    }
  }, [userHistory])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-2/3 max-md:w-full max-w-none sm:max-w-full flex flex-col justify-start items-start top-[5vh] max-md:top-0 translate-y-0 gap-1 rounded-none">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          id="search-form"
          onSubmit={handleSearch}
          className="flex w-full items-center justify-start my-5 z-40"
        >
          <input type="text" tabIndex={-1} className="sr-only" autoFocus />
          <SearchInput
            placeholder={t("search")}
            className={cn(
              "max-w-[550px] border-r-0 rounded-r-none focus-visible:ring-[0px]"
            )}
            ref={searchInputRef}
            searchHistory={searchHistory}
            defaultValue={searchValue || ""}
            handleSelectOption={handleSelectOption}
            handleDeleteHistoryOption={handleDeleteHistoryOption}
          />
        </form>
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          {t("filter.clear_filters")}
        </Button>
        <ProductFilters
          selectedBrands={selectedBrands}
          selectedSkinTypes={selectedSkinTypes}
          selectedAction={selectedAction}
          selectedSortBy={sortBy}
          setSelectedBrands={setSelectedBrands}
          setSelectedSkinTypes={setSelectedSkinTypes}
          setSelectedAction={setSelectedAction}
          setSelectedSortBy={setSortBy}
        />
        <DialogFooter className="w-full flex items-center">
          <DialogClose asChild>
            <Button variant="ghost">{t("close")}</Button>
          </DialogClose>
          <Button variant="default" form="search-form">
            {t("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default memo(SearchDialogModal)
