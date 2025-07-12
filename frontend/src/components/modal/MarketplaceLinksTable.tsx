// src/components/admin/MarketplaceLinksTable.tsx
import React, { useState, useEffect } from "react";
import {
    Input,
} from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import FilterCombobox from "@/components/HomeComponents/FilterCombobox";
import {TrashIcon} from "@/components/modal/ActionIcons.tsx";

interface MarketplaceLink {
    id: number;
    name: string;
    url: string;
    locale: string; // Например: 'RU', 'EN', 'KR'
}

interface MarketplaceLinksTableProps {
    links?: MarketplaceLink[];
    onChange: (links: MarketplaceLink[]) => void;
}

const MarketplaceLinksTable: React.FC<MarketplaceLinksTableProps> = ({
                                                                         links = [],
                                                                         onChange,
                                                                     }) => {
    const [newLink, setNewLink] = useState<Omit<MarketplaceLink, "id">>({
        name: "",
        url: "",
        locale: "RU",
    });

    const locales = [
        { id: "RU", name: "RU" },
        { id: "EN", name: "EN" },
        { id: "KR", name: "KR" },
    ];

    const [selectedLocale, setSelectedLocale] = useState<string[]>([newLink.locale]);
    const [marketplaceLinks, setMarketplaceLinks] = useState<MarketplaceLink[]>([]);

    // При изменении внешнего props.links обновляем локальное состояние
    useEffect(() => {
        if (links.length > 0) {
            setMarketplaceLinks([...links]);
        } else {
            setMarketplaceLinks([]);
        }
    }, [links]);

    const handleAdd = () => {
        const { name, url, locale } = newLink;

        if (!name.trim() || !url.trim()) {
            alert("Заполните все поля");
            return;
        }

        const validLocales = ["RU", "EN", "KR"];
        if (!validLocales.includes(locale)) {
            alert("Выберите корректную локализацию");
            return;
        }

        const isValidUrl = /^(https?:\/\/)/.test(url);
        if (!isValidUrl) {
            alert("Ссылка должна начинаться с http:// или https://");
            return;
        }

        const updatedLinks = [
            ...marketplaceLinks,
            { ...newLink, id: Date.now() } as MarketplaceLink,
        ];

        setMarketplaceLinks(updatedLinks);
        onChange(updatedLinks);
        setNewLink({ name: "", url: "", locale: "RU" });
        setSelectedLocale(["RU"]);
    };

    const handleDelete = (id: number) => {
        const updatedLinks = marketplaceLinks.filter((link) => link.id !== id);
        setMarketplaceLinks(updatedLinks);
        onChange(updatedLinks);
    };

    return (
        <div className="space-y-4">
            <h5 className="text-lg font-semibold">Ссылки на маркетплейсы</h5>

            {/* Форма добавления */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                    <Input
                        type="text"
                        value={newLink.name}
                        onChange={(e) =>
                            setNewLink({ ...newLink, name: e.target.value })
                        }
                        placeholder="Введите название: Ozon"
                    />
                </div>
                <div>
                    <Input
                        type="url"
                        value={newLink.url}
                        onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                        }
                        placeholder="URL: https://example.com "
                    />
                </div>
                <div>
                    <FilterCombobox
                        label=""
                        options={locales}
                        values={selectedLocale}
                        onChange={(values) => {
                            setSelectedLocale(values)
                            setNewLink({
                                ...newLink,
                                locale: values[0] || "",
                            })
                        }}
                        singleSelect
                    />
                </div>
                <div>
                    <Button type="button" onClick={handleAdd}>Добавить</Button>
                </div>
            </div>

            {/* Таблица ссылок */}
            {marketplaceLinks.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Ссылка</TableHead>
                                <TableHead>Локализация</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {marketplaceLinks.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell className="font-medium">{link.name}</TableCell>
                                    <TableCell>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            {link.url}
                                        </a>
                                    </TableCell>
                                    <TableCell>{link.locale}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleDelete(link.id)}>
                                            <TrashIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default MarketplaceLinksTable;