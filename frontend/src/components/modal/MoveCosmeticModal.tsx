// components/MoveCosmeticModal.tsx

import React, { useState } from 'react';
import FilterCombobox from "@/components/HomeComponents/FilterCombobox";
import type { Catalog1 } from "@/model/types";

interface MoveCosmeticModalProps {
    isOpen: boolean;
    catalogs: Catalog1[];
    currentCosmeticName: string | null;
    onClose: () => void;
    onConfirm: (catalogId: number) => void;
}

const MoveCosmeticModal: React.FC<MoveCosmeticModalProps> = ({
                                                                 isOpen,
                                                                 catalogs,
                                                                 currentCosmeticName,
                                                                 onClose,
                                                                 onConfirm,
                                                             }) => {
    const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const selectedCatalog = catalogs.find(c => c.id === Number(selectedCatalogIds[0]));

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Выберите новый каталог</h2>
                <p className="mb-4">Перенести косметику "{currentCosmeticName}" в:</p>

                {/* Адаптация под типы FilterCombobox */}
                <FilterCombobox
                    label=""
                    options={catalogs.map(cat => ({ name: cat.name, id: String(cat.id) }))}
                    values={selectedCatalogIds}
                    onChange={setSelectedCatalogIds}
                    singleSelect
                />

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => {
                            if (selectedCatalog) {
                                onConfirm(selectedCatalog.id);
                            }
                        }}
                        disabled={!selectedCatalog}
                        className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                            !selectedCatalog ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Перенести
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveCosmeticModal;