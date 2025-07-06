import React, { useState, useEffect } from "react";
import FilterCombobox from "@/components/HomeComponents/FilterCombobox";
import type {
    BrandView,
    Catalog,
    CosmeticActionView, ImageResponse,
    IngredientView,
    SkinTypeView,
} from "@/model/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getAllCosmeticActions } from "@/services/adminCosmeticActionApi.ts";
import { getAllBrands } from "@/services/adminBrandApi.ts";
import { getAllCatalogs } from "@/services/adminCatalogApi.ts";
import { getAllSkinType } from "@/services/adminSkinTypeApi.ts";
import { getAllIngredients } from "@/services/adminIngredientApi.ts";
import FeedbackModal from "@/components/admin/FeedbackModal";
import { updateCosmetic } from "@/services/adminCosmeticApi";

interface EditCosmeticModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditSuccess: () => void;
    initialData: {
        id: number;
        name: string;
        description: string;
        brandId: number | null;
        catalogId: number | null;
        compatibility: string;
        usageRecommendations: string;
        applicationMethod: string;
        actions: CosmeticActionView[];
        skinTypes: SkinTypeView[];
        ingredients: IngredientView[];
        imageUrls: string[]; // Добавлено поле для изображений
    };
}

const EditCosmeticModal: React.FC<EditCosmeticModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onEditSuccess,
                                                                 initialData,
                                                             }) => {
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Справочники
    const [brands, setBrands] = useState<BrandView[]>([]);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [actions, setActions] = useState<CosmeticActionView[]>([]);
    const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([]);
    const [ingredients, setIngredients] = useState<IngredientView[]>([]);
    const [images, setImages] = useState<ImageResponse[]>([]);

    // Локальные данные формы
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [brandId, setBrandId] = useState<number | null>(initialData?.brandId || null);
    const [catalogId, setCatalogId] = useState<number | null>(initialData?.catalogId || null);
    const [compatibility, setCompatibility] = useState(initialData?.compatibility || "");
    const [usageRecommendations, setUsageRecommendations] = useState(
        initialData?.usageRecommendations || ""
    );
    const [applicationMethod, setApplicationMethod] = useState(
        initialData?.applicationMethod || ""
    );
    const [actionIds, setActionIds] = useState<number[]>(
        initialData?.actions.map((a) => a.id) || []
    );
    const [skinTypeIdList, setSkinTypeIdList] = useState<number[]>(
        initialData?.skinTypes.map((s) => s.id) || []
    );
    const [ingredientIds, setIngredientIds] = useState<number[]>(
        initialData?.ingredients.map((i) => i.id) || []
    );

    // Состояние для изображений
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setBrandId(initialData.brandId);
            setCatalogId(initialData.catalogId);
            setCompatibility(initialData.compatibility);
            setUsageRecommendations(initialData.usageRecommendations);
            setApplicationMethod(initialData.applicationMethod);
            setActionIds(initialData.actions.map((a) => a.id));
            setSkinTypeIdList(initialData.skinTypes.map((s) => s.id));
            setIngredientIds(initialData.ingredients.map((i) => i.id));
            // Обработка изображений
            if (initialData.images && Array.isArray(initialData.images)) {
                const mainImage = initialData.images.find(img => img.isMain === true);
                const otherImages = initialData.images.filter(img => img.isMain === false);

                // Добавляем http://localhost:8080 к URL
                const getFullUrl = (url: string) =>
                    url.startsWith("http") ? url : `http://localhost:8080${url}`;

                // Устанавливаем главное изображение
                setMainImageUrl(mainImage ? getFullUrl(mainImage.url) : null);

                // Устанавливаем дополнительные изображения
                setImageUrls(otherImages.map(img => getFullUrl(img.url)));
            } else {
                setImageUrls([]);
                setMainImageUrl(null);
            }
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    brandData,
                    catalogData,
                    actionData,
                    skinTypeData,
                    ingredientData,
                ] = await Promise.all([
                    getAllBrands(),
                    getAllCatalogs(),
                    getAllCosmeticActions(),
                    getAllSkinType(),
                    getAllIngredients(),
                ]);
                setBrands(brandData);
                setCatalogs(catalogData);
                setActions(actionData);
                setSkinTypes(skinTypeData);
                setIngredients(ingredientData);
            } catch (err: any) {
                setError(err.message || "Ошибка загрузки данных");
                console.error(err);
            }
        };
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Название не может быть пустым");
            return;
        }

        try {
            const updatedCosmetic = {
                id: initialData.id,
                name,
                description,
                brandId: brandId || undefined,
                catalogId: catalogId || undefined,
                compatibility,
                usageRecommendations,
                applicationMethod,
                actionIds,
                skinTypeIds: skinTypeIdList,
                keyIngredientIds: ingredientIds,
                imageUrls, // Добавляем изображения
            };

            await updateCosmetic(initialData.id, updatedCosmetic);
            setMessage("Косметика успешно обновлена!");
            setError(null);
            setTimeout(() => {
                onEditSuccess();
                onClose();
            }, 500);
        } catch (err: any) {
            setError(err.message || "Ошибка при сохранении изменений");
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls.splice(index, 1);
        setImageUrls(updatedImageUrls);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                {/* Modal Content */}
                <div className="p-6">
                    <h4 className="text-xl font-semibold text-center mb-6">
                        Редактировать косметику
                    </h4>
                    {error && (
                        <div className="text-red-500 text-sm mb-4">{error}</div>
                    )}
                    {message && (
                        <div className="text-green-500 text-sm mb-4">{message}</div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Основные поля */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Название
                                </label>
                                <Input
                                    id="editName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <FilterCombobox
                                label="Бренд"
                                options={brands}
                                values={brandId ? [brandId.toString()] : []}
                                onChange={(selected) =>
                                    setBrandId(selected.length > 0 ? parseInt(selected[0]) : null)
                                }
                                singleSelect
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <FilterCombobox
                                label="Каталог"
                                options={catalogs}
                                values={catalogId ? [catalogId.toString()] : []}
                                onChange={(selected) =>
                                    setCatalogId(selected.length > 0 ? parseInt(selected[0]) : null)
                                }
                                singleSelect
                            />
                            <FilterCombobox
                                label="Тип кожи"
                                options={skinTypes}
                                values={skinTypeIdList.map((id) => id.toString())}
                                onChange={(selected) =>
                                    setSkinTypeIdList(selected.map((id) => parseInt(id)))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <FilterCombobox
                                label="Действия"
                                options={actions}
                                values={actionIds.map((id) => id.toString())}
                                onChange={(selected) =>
                                    setActionIds(selected.map((id) => parseInt(id)))
                                }
                            />
                            <FilterCombobox
                                label="Ингредиенты"
                                options={ingredients}
                                values={ingredientIds.map((id) => id.toString())}
                                onChange={(selected) =>
                                    setIngredientIds(selected.map((id) => parseInt(id)))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="editCompatibility" className="block text-sm font-medium text-gray-700 mb-1">
                                    Совместимость
                                </label>
                                <Textarea
                                    id="editCompatibility"
                                    rows={3}
                                    value={compatibility}
                                    onChange={(e) => setCompatibility(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="editUsage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Рекомендации по применению
                                </label>
                                <Textarea
                                    id="editUsage"
                                    rows={3}
                                    value={usageRecommendations}
                                    onChange={(e) => setUsageRecommendations(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="editApplication" className="block text-sm font-medium text-gray-700 mb-1">
                                    Способ применения
                                </label>
                                <Textarea
                                    id="editApplication"
                                    rows={3}
                                    value={applicationMethod}
                                    onChange={(e) => setApplicationMethod(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="formMainImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Главное изображение
                                </label>
                                <Input
                                    id="formMainImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setMainImageFile(e.target.files[0]);
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            setMainImageUrl(url);
                                        }
                                    }}
                                    className=""
                                />
                                <small className="text-gray-500 mt-1 block">
                                    Выберите главное изображение
                                </small>
                            </div>
                            <div>
                                <label htmlFor="formImages" className="block text-sm font-medium text-gray-700 mb-1">
                                    Изображения
                                </label>
                                <Input
                                    id="formImages"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setImageFiles(Array.from(e.target.files));
                                            const urls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                                            setImageUrls(urls);
                                        }
                                    }}
                                    className=""
                                />
                                <small className="text-gray-500 mt-1 block">
                                    Можно выбрать несколько изображений
                                </small>
                            </div>
                            <div className="mt-6">
                                <h5 className="text-lg font-semibold mb-2">Предварительный просмотр:</h5>
                                {mainImageUrl && (
                                    <div className="mb-2">
                                        <strong>Главное изображение:</strong>
                                        <img src={mainImageUrl} alt="Главное изображение" className="w-full h-40 object-cover rounded-md" />
                                    </div>
                                )}
                                {imageUrls.length > 0 && (
                                    <div>
                                        <strong>Дополнительные изображения:</strong>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {imageUrls.map((url, index) => (
                                                <div key={index}>
                                                    <img src={url} alt={`Изображение ${index + 1}`} className="w-full h-40 object-cover rounded-md" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Сохранить изменения
                            </button>
                        </div>
                    </form>

                    {/* Отображение изображений */}
                    <div className="mt-6">
                        <h5 className="text-lg font-semibold mb-2">Изображения:</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {imageUrls.map((imageUrl, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={imageUrl}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-sm"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCosmeticModal;