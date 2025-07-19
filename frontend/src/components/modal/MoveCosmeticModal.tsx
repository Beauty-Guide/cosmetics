// MoveCosmeticModal.tsx

import React, {useState} from 'react';
import FilterCombobox from "@/components/HomeComponents/FilterCombobox";
import type { Catalog1 } from "@/model/types";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

interface MoveCosmeticModalProps {
    isOpen: boolean;
    catalogs: Catalog1[];
    currentCosmeticName: string | null;
    cosmeticId: number;
    onConfirm: (catalogId: number, cosmeticId: number) => void;
    onClose: () => void;
}

const MoveCosmeticModal: React.FC<MoveCosmeticModalProps> = ({
                                                                 isOpen,
                                                                 catalogs,
                                                                 currentCosmeticName,
                                                                 cosmeticId,
                                                                 onConfirm,
                                                                 onClose,
                                                             }) => {
    const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const selectedCatalog = catalogs.find(c => c.id === Number(selectedCatalogIds[0]));

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="w-96">
                <DialogHeader>
                    <DialogTitle>Выберите новый каталог</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="mb-4">Перенести косметику "{currentCosmeticName}" в:</p>

                    <FilterCombobox
                        label=""
                        options={catalogs.map((cat) => ({
                            name: cat.name,
                            id: String(cat.id),
                        }))}
                        values={selectedCatalogIds}
                        onChange={setSelectedCatalogIds}
                        singleSelect
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedCatalog) {
                                onConfirm(selectedCatalog.id, cosmeticId); // ← отправляем оба аргумента
                            }
                        }}
                        disabled={!selectedCatalog}
                    >
                        Перенести
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MoveCosmeticModal;