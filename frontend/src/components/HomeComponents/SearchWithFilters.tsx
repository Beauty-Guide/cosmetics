import { useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import FilterCombobox from "./FilterCombobox"
import { useTranslation } from "react-i18next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetAllAction } from "@/hooks/getAllAction"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import SearhInput from "@/components/SearhInput"
import { MobileFilterPage } from "./MobileFilterPage"

type TUserHistory = {
    id: number
    searchQuery: string
    timestamp: Date
}

type TProductFiltersProps = {
    selectedBrands: string[]
    selectedSkinTypes: string[]
    selectedAction: string[]
    selectedSortBy: string[]
    setSelectedBrands: (brands: string[]) => void
    setSelectedSkinTypes: (skinTypes: string[]) => void
    setSelectedAction: (actions: string[]) => void
    setSelectedSortBy: (sortBy: string[]) => void
    // Новые пропсы для поиска с историей
    searchHistory?: TUserHistory[]
    onSearch?: (query: string) => void
    onDeleteHistoryItem?: (id: number) => void
    onSubmitFilters: () => void
}

export const SearchWithFilters = ({
                                      selectedBrands,
                                      selectedSkinTypes,
                                      selectedAction,
                                      selectedSortBy,
                                      setSelectedBrands,
                                      setSelectedSkinTypes,
                                      setSelectedAction,
                                      setSelectedSortBy,
                                      searchHistory = [],
                                      onSearch = () => {},
                                      onDeleteHistoryItem = () => {},
                                      onSubmitFilters,
                                  }: TProductFiltersProps) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const isMobile = window.innerWidth < 768

    const { data: brands } = useGetAllBrands()
    const { data: skinTypes } = useGetAllSkinType()
    const { data: actions } = useGetAllAction()

    const sortByOptions = [
        { name: t("filter.sort_by_date"), id: "byDate" },
        { name: t("filter.sort_by_popularity"), id: "byPopularity" },
        { name: t("filter.sort_by_favorites"), id: "byFavourite" },
    ]

    const handleApplyFilters = () => {
        onSubmitFilters()
        setIsOpen(false)
    }

    const handleReset = () => {
        setSelectedBrands([])
        setSelectedSkinTypes([])
        setSelectedAction([])
        setSelectedSortBy([])
        onSubmitFilters()
    }

    return (
        <>
            {/* Кнопка поиска */}
            <button
                type="button"
                style={{ width: "100%" }}
                onClick={() => (isMobile ? setShowMobileFilters(true) : setIsOpen(true))}
                className="flex items-center gap-2 px-4 py-2 h-9 w-full md:w-auto border rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50"
            >
                <SearchIcon className="w-5 h-5 text-gray-500" />
                <span>{t("search")}</span>
                {(selectedBrands.length > 0 ||
                    selectedSkinTypes.length > 0 ||
                    selectedAction.length > 0) && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
            {selectedBrands.length + selectedSkinTypes.length + selectedAction.length}
          </span>
                )}
            </button>

            {/* Боковая панель справа (для десктопа) */}
            {isOpen && !isMobile && (
                <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-[400px] max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium">{t("search")}</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                        >
                            <XIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <ScrollArea className="flex-1 px-4 pb-4">
                        <div className="space-y-4">
                            <SearhInput
                                placeholder={t("search")}
                                searchHistory={searchHistory}
                                handleSelectOption={(query) => {
                                    onSearch(query)
                                    onSubmitFilters()
                                }}
                                handleDeleteHistoryOption={(id) => {
                                    onDeleteHistoryItem(id)
                                }}
                            />
                            <FilterCombobox
                                label={t("filter.select_brand")}
                                options={brands || []}
                                values={selectedBrands}
                                onChange={setSelectedBrands}
                                labels={false}
                                singleSelect={false}
                            />
                            <FilterCombobox
                                label={t("filter.select_skin_type")}
                                options={skinTypes || []}
                                values={selectedSkinTypes}
                                onChange={setSelectedSkinTypes}
                                labels={false}
                                singleSelect={false}
                            />
                            <FilterCombobox
                                label={t("filter.select_action")}
                                options={actions || []}
                                values={selectedAction}
                                onChange={setSelectedAction}
                                labels={false}
                                singleSelect={false}
                            />
                            <FilterCombobox
                                label={t("filter.sort_by")}
                                options={sortByOptions}
                                values={selectedSortBy}
                                onChange={setSelectedSortBy}
                                labels={false}
                                singleSelect={true}
                            />
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-white flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={handleReset}>
                            {t("filter.reset")}
                        </Button>
                        <Button className="flex-1" onClick={handleApplyFilters}>
                            {t("filter.apply")}
                        </Button>
                    </div>
                </div>
            )}

            {/* Overlay при открытом меню */}
            {isOpen && !isMobile && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Мобильная страница — осталась как есть */}
            {showMobileFilters && (
                <MobileFilterPage
                    selectedBrands={selectedBrands}
                    selectedSkinTypes={selectedSkinTypes}
                    selectedAction={selectedAction}
                    selectedSortBy={selectedSortBy}
                    setSelectedBrands={setSelectedBrands}
                    setSelectedSkinTypes={setSelectedSkinTypes}
                    setSelectedAction={setSelectedAction}
                    setSelectedSortBy={setSelectedSortBy}
                    onClose={() => setShowMobileFilters(false)}
                    searchHistory={searchHistory}
                    onSearch={onSearch}
                    onDeleteHistoryItem={onDeleteHistoryItem}
                    onSubmitFilters={onSubmitFilters}
                />
            )}
        </>
    )
}