import { Dialog } from "@headlessui/react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetAllAction } from "@/hooks/getAllAction"
import { useGetAllSkinType } from "@/hooks/getAllSkinType"
import { useGetAllBrands } from "@/hooks/getAllbrands"
import SearhInput from "@/components/SearhInput.tsx"
import FilterCombobox from "./FilterCombobox"

type TUserHistory = {
    id: number
    searchQuery: string
    timestamp: Date
}

type TMobileFilterPageProps = {
    selectedBrands: string[]
    selectedSkinTypes: string[]
    selectedAction: string[]
    selectedSortBy: string[]
    setSelectedBrands: (brands: string[]) => void
    setSelectedSkinTypes: (skinTypes: string[]) => void
    setSelectedAction: (actions: string[]) => void
    setSelectedSortBy: (sortBy: string[]) => void
    onClose: () => void
    searchHistory?: TUserHistory[]
    onSearch?: (query: string) => void
    onDeleteHistoryItem?: (id: number) => void
    onSubmitFilters: () => void
}

export const MobileFilterPage = ({
                                     selectedBrands,
                                     selectedSkinTypes,
                                     selectedAction,
                                     selectedSortBy,
                                     setSelectedBrands,
                                     setSelectedSkinTypes,
                                     setSelectedAction,
                                     setSelectedSortBy,
                                     onClose,
                                     searchHistory = [],
                                     onSearch = () => {},
                                     onDeleteHistoryItem = () => {},
                                     onSubmitFilters,
                                 }: TMobileFilterPageProps) => {
    const { t } = useTranslation()
    const { data: brands } = useGetAllBrands()
    const { data: skinTypes } = useGetAllSkinType()
    const { data: actions } = useGetAllAction()
    const sortByOptions = [
        { name: t("filter.sort_by_date"), id: "byDate" },
        { name: t("filter.sort_by_popularity"), id: "byPopularity" },
        { name: t("filter.sort_by_favorites"), id: "byFavourite" },
    ]

    const handleApply = () => {
        console.log("handleApply")
        onSubmitFilters()
        onClose()
    }

    const handleReset = () => {
        setSelectedBrands([])
        setSelectedSkinTypes([])
        setSelectedAction([])
        setSelectedSortBy([])
        onSubmitFilters()
        onClose()
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-end p-0">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-l-2xl bg-white h-screen shadow-xl transition-all">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">{t("search")}</h3>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <ScrollArea className="px-4 pt-4 pb-20">
                            <div className="space-y-4">
                                <SearhInput
                                    placeholder={t("search")}
                                    searchHistory={searchHistory}
                                    handleSelectOption={(query) => {
                                        onSearch(query)
                                        onSubmitFilters()
                                    }}
                                    handleDeleteHistoryOption={onDeleteHistoryItem}
                                />

                                <FilterCombobox
                                    label={t("filter.select_brand")}
                                    options={brands}
                                    values={selectedBrands}
                                    onChange={setSelectedBrands}
                                    labels={false}
                                    singleSelect={false}
                                />
                                <FilterCombobox
                                    label={t("filter.select_skin_type")}
                                    options={skinTypes}
                                    values={selectedSkinTypes}
                                    onChange={setSelectedSkinTypes}
                                    labels={false}
                                    singleSelect={false}
                                />
                                <FilterCombobox
                                    label={t("filter.select_action")}
                                    options={actions}
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
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={handleReset}>
                                {t("filter.reset")}
                            </Button>
                            <Button className="flex-1" onClick={handleApply}>
                                {t("filter.apply")}
                            </Button>
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}