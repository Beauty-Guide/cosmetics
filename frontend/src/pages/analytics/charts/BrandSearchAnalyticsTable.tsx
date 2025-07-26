import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

// Вспомогательная функция: форматирует CountItem[] в список "label (count)"
const formatWithCount = (items: any[]) => {
    if (!items || items.length === 0) return <span>–</span>;
    return items
        .sort((a, b) => b.count - a.count) // сортировка по убыванию
        .map((item, index) => (
            <div key={index}>{`${item.label} (${item.count})`}</div>
        ));
};

interface BrandSearchAnalyticsTableProps {
    data: any[];
}

const BrandSearchAnalyticsTable: React.FC<BrandSearchAnalyticsTableProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Состояние для поиска
    const [currentPage, setCurrentPage] = useState<number>(1); // Состояние для пагинации
    const itemsPerPage = 5; // Количество элементов на странице

    // Фильтрация данных по поисковому запросу
    const filteredData = data.filter(item =>
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) return <p>Загрузка аналитики по брендам...</p>;
    if (data.length === 0) return <p>Нет данных о поисковых фильтрах.</p>;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Аналитика по брендам и фильтрам</h2>
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <div className="mb-4">
                    <Input
                        placeholder="Поиск по бренду..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Сбросить страницу при изменении поиска
                        }}
                    />
                </div>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Бренд</TableHead>
                                <TableHead>Типы кожи (частота выбора)</TableHead>
                                <TableHead>Действия (частота выбора)</TableHead>
                                <TableHead>Поисковые запросы (частота)</TableHead>
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
                {/* Пагинация */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                            Показано {indexOfFirstItem + 1}-{" "}
                            {Math.min(indexOfLastItem, filteredData.length)} из{" "}
                            {filteredData.length}
                        </span>
                        <nav className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={currentPage === 1}
                            >
                                Предыдущая
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                            >
                                Следующая
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandSearchAnalyticsTable;