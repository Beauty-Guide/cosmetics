import React, {useEffect, useState} from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle} from '@/components/ui/drawer';
import {t} from "i18next";
import {useTranslation} from "react-i18next";

const formatWithCount = (items: any[]) => {
    if (!items || items.length === 0) return <span>–</span>;
    return items
        .sort((a, b) => b.count - a.count)
        .map((item, index) => (
            <div key={index} className="py-1">{`${item.label} (${item.count})`}</div>
        ));
};

interface BrandSearchAnalyticsTableProps {
    data: any[];
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addListener(listener);
        return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
}

const BrandSearchAnalyticsTable: React.FC<BrandSearchAnalyticsTableProps> = ({ data }) => {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const itemsPerPage = 5;
    const { t } = useTranslation()

    const filteredData = data.filter(item =>
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) return <p></p>;
    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t("analytics.brand.search")}</h2>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    const handleRowClick = (brandData: any) => {
        if (isMobile) {
            setSelectedBrand(brandData);
        }
    };

    return (
        <div className="mt-8">
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t("analytics.brand.search")}</h2>

                <div className="mb-4">
                    <Input
                        placeholder={t("analytics.brand.search.byBrand")}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {isMobile ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("filter.brand")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <TableCell>{item.brand}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("filter.brand")}</TableHead>
                                    <TableHead>{t("analytics.skinType.frequency")}</TableHead>
                                    <TableHead>{t("analytics.actions.frequency")}</TableHead>
                                    <TableHead>{t("analytics.query.frequency")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell>{item.brand}</TableCell>
                                        <TableCell>{formatWithCount(item.skinTypes)}</TableCell>
                                        <TableCell>{formatWithCount(item.actions)}</TableCell>
                                        <TableCell>{formatWithCount(item.queries)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                            {t("table.view")} {indexOfFirstItem + 1}-{" "}
                            {Math.min(indexOfLastItem, filteredData.length)} {t("table.from")} {" "}
                            {filteredData.length}
                        </span>
                        <nav className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                {t("table.prev")}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                {t("table.next")}
                            </Button>
                        </nav>
                    </div>
                )}
            </div>

            <div className="md:hidden">
                <Drawer open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
                    <DrawerContent aria-describedby={undefined}>
                        <div className="mx-auto w-full max-w-sm overflow-y-auto">
                            <DrawerHeader>
                                <DrawerTitle className="text-gray-800">
                                    {selectedBrand?.brand || t("no_brand_selected")}
                                </DrawerTitle>
                            </DrawerHeader>
                            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
                                <div className="pb-4">
                                    <h3 className="font-medium text-lg mb-2">{t("analytics.skinType.frequency")}</h3>
                                    {formatWithCount(selectedBrand?.skinTypes || [])}
                                </div>
                                <div className="py-4">
                                    <h3 className="font-medium text-lg mb-2">{t("analytics.actions.frequency")}</h3>
                                    {formatWithCount(selectedBrand?.actions || [])}
                                </div>
                                <div className="pt-4">
                                    <h3 className="font-medium text-lg mb-2">{t("analytics.query.frequency")}</h3>
                                    {formatWithCount(selectedBrand?.queries || [])}
                                </div>
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button variant="outline" onClick={() => setSelectedBrand(null)}>
                                        {t("close")}
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
};

export default BrandSearchAnalyticsTable;