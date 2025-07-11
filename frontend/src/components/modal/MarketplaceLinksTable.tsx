// src/components/admin/MarketplaceLinksTable.tsx
import React, { useState, useEffect } from "react";
import {Input} from "@/components/ui/input.tsx";
import FilterCombobox from "@/components/HomeComponents/FilterCombobox.tsx";

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
    ]
    const [selectedLocale, setSelectedLocale] = useState<string[]>(["RU"])
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="URL: https://example.com "
                    />
                </div>
                <div>
                    {/*<select*/}
                    {/*    value={newLink.locale}*/}
                    {/*    onChange={(e) =>*/}
                    {/*        setNewLink({ ...newLink, locale: e.target.value })*/}
                    {/*    }*/}
                    {/*    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
                    {/*>*/}
                    {/*    <option value="RU">RU</option>*/}
                    {/*    <option value="EN">EN</option>*/}
                    {/*    <option value="KR">KR</option>*/}
                    {/*</select>*/}

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
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Добавить
                    </button>
                </div>
            </div>

            {/* Таблица ссылок */}
            {marketplaceLinks.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Название</th>
                            <th className="px-4 py-2 text-left">Ссылка</th>
                            <th className="px-4 py-2 text-left">Локализация</th>
                            <th className="px-4 py-2 text-center">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {marketplaceLinks.map((link) => (
                            <tr key={link.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{link.name}</td>
                                <td className="px-4 py-2">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {link.url}
                                    </a>
                                </td>
                                <td className="px-4 py-2">{link.locale}</td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MarketplaceLinksTable;