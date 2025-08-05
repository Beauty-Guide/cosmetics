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
import type { User } from "@/model/types";
import {getAllSeller} from "@/services/sellerApi.ts";

interface MarketplaceLink {
    id: string | number; // Updated to allow both string and number
    type?: string; // Made optional
    name: string;
    url: string;
    locale: string;
    sellerId?: number;
}

interface MarketplaceLinksTableProps {
    links?: MarketplaceLink[];
    onChange: (links: MarketplaceLink[]) => void;
    onDeleted: (links: MarketplaceLink[]) => void;
}

const MarketplaceLinksTable: React.FC<MarketplaceLinksTableProps> = ({
                                                                         links = [],
                                                                         onChange,
                                                                         onDeleted,
                                                                     }) => {
    const [newLink, setNewLink] = useState<Omit<MarketplaceLink, "id">>({
        name: "",
        url: "",
        locale: "RU",
        sellerId: undefined
    });

    const locales = [
        { id: "RU", name: "RU" },
        { id: "EN", name: "EN" },
        { id: "KR", name: "KR" },
    ];

    const [selectedLocale, setSelectedLocale] = useState<string[]>([newLink.locale]);
    const [marketplaceLinks, setMarketplaceLinks] = useState<MarketplaceLink[]>([]);
    const [sellers, setSellers] = useState<User[]>([]);
    const [rows, setRows] = useState<MarketplaceLink[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<string[]>([]);

    /* --- загрузка продавцов --- */
    useEffect(() => {
        getAllSeller()
            .then(setSellers)
            .catch(() => setSellers([]));
    }, []);

    // При изменении внешнего props.links обновляем локальное состояние
    useEffect(() => {
        const filteredLinks = links.filter(link => link.type !== "delete");
        if (filteredLinks.length > 0) {
            setMarketplaceLinks([...filteredLinks]);
            setRows([...filteredLinks]);
        } else {
            setMarketplaceLinks([]);
            setRows([]);
        }
    }, [links]);

    const sellerOptions = sellers.map((s) => ({ id: String(s.id), name: s.username || "" }));

    const handleAdd = () => {
        const { name, url, locale, sellerId } = newLink;

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
        if (!sellerId) {
            alert("Выберите продавца");
            return;
        }

        const newLinkWithId = {
            ...newLink,
            id: "id_" + Date.now(),
            type: "new"
        } as MarketplaceLink;

        const updatedLinks = [...marketplaceLinks, newLinkWithId];

        setMarketplaceLinks(updatedLinks);
        setRows(updatedLinks);
        onChange(updatedLinks);
        setNewLink({ name: "", url: "", locale: "RU", sellerId: undefined });
        setSelectedLocale(["RU"]);
        setSelectedSeller([]);
    };

    const handleDelete = (id: string | number) => {
        const updated = rows.map(row =>
            row.id === id ? { ...row, type: "delete" } : row
        );
        const activeLinks = updated.filter(link => link.type !== "delete");
        const deletedLinks = updated.filter(link => link.type === "delete");
        for (let i = deletedLinks.length - 1; i >= 0; i--) {
            const id = deletedLinks[i].id;
            if (typeof id === 'string') {
                if (deletedLinks[i].id.startsWith("id_")) {
                    deletedLinks.splice(i, 1);
                }
            }
        }

        setRows(activeLinks);
        onChange(activeLinks);
        onDeleted(deletedLinks);
    };

    const handleChange = (id: string | number, field: keyof MarketplaceLink, value: any) => {
        const updated = rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setRows(updated);
        onChange(updated);
    };

    // Filter out deleted items before rendering
    const visibleLinks = marketplaceLinks.filter(link => link.type !== "delete");

    return (
        <div className="space-y-4">
            <h5 className="text-lg font-semibold">Ссылки на маркетплейсы</h5>

            {/* Форма добавления */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
                    <FilterCombobox
                        label=""
                        options={sellerOptions}
                        values={selectedSeller}
                        onChange={(v) => {
                            setSelectedSeller(v);
                            setNewLink({ ...newLink, sellerId: v.length ? Number(v[0]) : undefined });
                        }}
                        singleSelect
                        placeholder="Продавец"
                    />
                </div>
                <div>
                    <Button type="button" onClick={handleAdd}>Добавить</Button>
                </div>
            </div>

            {/* Таблица */}
            {visibleLinks.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Ссылка</TableHead>
                                <TableHead>Локализация</TableHead>
                                <TableHead>Продавец</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleLinks.map((l) => (
                                <TableRow key={l.id}>
                                    {/* Название */}
                                    <TableCell>
                                        <Input
                                            value={l.name}
                                            onChange={(e) => handleChange(l.id, "name", e.target.value)}
                                        />
                                    </TableCell>
                                    {/* URL */}
                                    <TableCell>
                                        <Input
                                            value={l.url}
                                            onChange={(e) => handleChange(l.id, "url", e.target.value)}
                                        />
                                    </TableCell>
                                    {/* Локаль */}
                                    <TableCell>
                                        <FilterCombobox
                                            label=""
                                            options={locales}
                                            values={[l.locale]}
                                            onChange={(v) => handleChange(l.id, "locale", v[0] ?? "RU")}
                                            singleSelect
                                            placeholder="—"
                                        />
                                    </TableCell>
                                    {/* Продавец */}
                                    <TableCell>
                                        <FilterCombobox
                                            label=""
                                            options={sellerOptions}
                                            values={l.sellerId ? [String(l.sellerId)] : []}
                                            onChange={(v) => handleChange(l.id, "sellerId", v.length ? Number(v[0]) : undefined)}
                                            singleSelect
                                            placeholder="—"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(l.id)}>
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