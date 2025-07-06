// src/components/admin/AddCosmeticModal.tsx
import React, { useState, useEffect } from "react";
import FilterCombobox from "@/components/HomeComponents/FilterCombobox";
import type {
    BrandView,
    Catalog,
    Cosmetic,
    CosmeticActionView,
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
import { useSearchParams } from "react-router";
import { addCosmetic } from "@/services/adminCosmeticApi.ts";
import { uploadCosmeticImages } from "@/services/fileApi.ts";

interface AddCosmeticModalProps {
    onAddSuccess: () => void;
}

const AddCosmeticModal: React.FC<AddCosmeticModalProps> = ({ onAddSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Справочники
    const [brands, setBrands] = useState<BrandView[]>([]);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [actions, setActions] = useState<CosmeticActionView[]>([]);
    const [skinTypes, setSkinTypes] = useState<SkinTypeView[]>([]);
    const [ingredients, setIngredients] = useState<IngredientView[]>([]);

    // Состояния формы
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [brandIds, setBrandIds] = useState<number[]>([]);
    const [catalogIds, setCatalogIds] = useState<number[]>([]);
    const [compatibility, setCompatibility] = useState("");
    const [usageRecommendations, setUsageRecommendations] = useState("");
    const [applicationMethod, setApplicationMethod] = useState("");
    const [actionIds, setActionIds] = useState<number[]>([]);
    const [skinTypeIds, setSkinTypeIds] = useState<number[]>([]);
    const [keyIngredientIds, setKeyIngredientIds] = useState<number[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null); // Новое состояние для главного изображения
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);


    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>(
        searchParams.getAll("catalog")
    );
    const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
        searchParams.getAll("skinType")
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.getAll("brand")
    );
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
        searchParams.getAll("ingredient")
    );
    const [selectedActions, setSelectedActions] = useState<string[]>(
        searchParams.getAll("actions")
    );

    // При открытии модального окна загружаем актуальные данные
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
                    getAllSkinType(), // ← убедитесь, что эта функция работает
                    getAllIngredients(),
                ]);
                console.log("skinTypes:", skinTypeData); // ← Логируем
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

    const resetForm = () => {
        setName("");
        setDescription("");
        setBrandIds([]);
        setCatalogIds([]);
        setCompatibility("");
        setUsageRecommendations("");
        setApplicationMethod("");
        setActionIds([]);
        setSkinTypeIds([]);
        setKeyIngredientIds([]);
        setImageFiles([]);
        setMainImageFile(null); // Сбрасываем главное изображение
        setMainImageUrl(null)
        setImageUrls([])
    };

    const handleCloseModal = () => {
        setIsSuccessModalOpen(false);
        onAddSuccess();
    };

    const handleAddCosmetic = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // Вызываем валидацию
        if (!validateForm()) {
            return; // Останавливаем выполнение, если форма невалидна
        }

        const actionIds = selectedActions.map(Number);
        const skinTypeIds = selectedSkinTypes.map(Number);
        const keyIngredientIds = selectedIngredients.map(Number);

        try {
            const cosmetic = {
                name,
                description,
                brandId: Number(selectedBrands[0]),
                catalogId: Number(selectedCatalogs[0]),
                compatibility,
                usageRecommendations,
                applicationMethod,
                actionIds,
                skinTypeIds,
                keyIngredientIds,
            };

            const response = await addCosmetic(cosmetic);
            console.log(response);

            if (!response || !response.data || !response.data.id) {
                setError("Не удалось получить ID новой косметики");
                return;
            }

            // 2. Загружаем изображения, если они есть
            const imageUploadPromises: Promise<void>[] = [];

            // Главное изображение
            if (mainImageFile) {
                imageUploadPromises.push(
                    uploadCosmeticImages(response.data.id, [mainImageFile], true)
                );
            }

            // Дополнительные изображения
            if (imageFiles.length > 0) {
                imageUploadPromises.push(
                    uploadCosmeticImages(response.data.id, imageFiles)
                );
            }

            // Ожидаем завершения всех загрузок
            await Promise.all(imageUploadPromises);

            setMessage("Косметика успешно добавлена!");
            setError(null);

            // Закрываем основное модальное окно через 500 мс
            setIsOpen(false);

            // После закрытия основного окна — открываем окно успеха
            setTimeout(() => {
                setIsSuccessModalOpen(true);
            }, 500); // время должно совпадать с длительностью анимации/скрытия AddCosmeticModal

            resetForm();
        } catch (err: any) {
            setError(err.message || "Произошла ошибка при добавлении косметики");
        }
    };

    const validateForm = () => {
        // Проверяем текстовые поля
        if (!name.trim()) {
            setError("Поле 'Название' не должно быть пустым");
            return false;
        }

        // Проверяем выпадающие списки (массивы)
        if (selectedBrands.length === 0) {
            setError("Выберите бренд");
            return false;
        }
        if (selectedCatalogs.length === 0) {
            setError("Выберите каталог");
            return false;
        }
        if (selectedSkinTypes.length === 0) {
            setError("Выберите тип кожи");
            return false;
        }
        if (selectedActions.length === 0) {
            setError("Выберите действие");
            return false;
        }
        if (selectedIngredients.length === 0) {
            setError("Выберите ингредиенты");
            return false;
        }
        if (!compatibility.trim()) {
            setError("Поле 'Совместимость' не должно быть пустым");
            return false;
        }
        if (!usageRecommendations.trim()) {
            setError("Поле 'Рекомендации по применению' не должно быть пустым");
            return false;
        }
        if (!applicationMethod.trim()) {
            setError("Поле 'Способ применения' не должно быть пустым");
            return false;
        }

        // Все проверки пройдены
        return true;
    };

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Добавить косметику
            </button>
            {/* Модальное окно */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                        >
                            &times;
                        </button>
                        {/* Modal Content */}
                        <div className="p-6">
                            <h4 className="text-xl font-semibold text-center mb-6">
                                Добавление косметики
                            </h4>
                            {/* Показываем ошибку здесь */}
                            {error && (
                                <div className="text-red-500 text-sm mb-4">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleAddCosmetic} className="space-y-6">
                                {/* Основные поля */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Название
                                        </label>
                                        <Input
                                            id="formName"
                                            type="text"
                                            placeholder="Введите название"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <FilterCombobox
                                        label="Бренд"
                                        options={brands}
                                        values={selectedBrands}
                                        onChange={setSelectedBrands}
                                        singleSelect
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <FilterCombobox
                                        label="Каталог"
                                        options={catalogs}
                                        values={selectedCatalogs}
                                        onChange={setSelectedCatalogs}
                                        singleSelect
                                    />
                                    <FilterCombobox
                                        label="Тип кожи"
                                        options={skinTypes}
                                        values={selectedSkinTypes}
                                        onChange={setSelectedSkinTypes}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <FilterCombobox
                                        label="Действия"
                                        options={actions}
                                        values={selectedActions}
                                        onChange={setSelectedActions}
                                    />
                                    <FilterCombobox
                                        label="Ингредиенты"
                                        options={ingredients}
                                        values={selectedIngredients}
                                        onChange={setSelectedIngredients}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="formCompatibility" className="block text-sm font-medium text-gray-700 mb-1">
                                            Совместимость
                                        </label>
                                        <Textarea
                                            id="formCompatibility"
                                            rows={3}
                                            placeholder="Пример: Подходит для всех типов кожи"
                                            value={compatibility}
                                            onChange={(e) => setCompatibility(e.target.value)}
                                            className=""
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="formUsage" className="block text-sm font-medium text-gray-700 mb-1">
                                            Рекомендации по применению
                                        </label>
                                        <Textarea
                                            id="formUsage"
                                            rows={3}
                                            placeholder="Как использовать средство"
                                            value={usageRecommendations}
                                            onChange={(e) => setUsageRecommendations(e.target.value)}
                                            className=""
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="formApplication" className="block text-sm font-medium text-gray-700 mb-1">
                                            Способ применения
                                        </label>
                                        <Textarea
                                            id="formApplication"
                                            rows={3}
                                            placeholder="Пример: Нанести утром и вечером"
                                            value={applicationMethod}
                                            onChange={(e) => setApplicationMethod(e.target.value)}
                                            className=""
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
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                        Добавить косметику
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


            )}
        </>
    );
};

export default AddCosmeticModal;