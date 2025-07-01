// types.ts
export interface AppError {
    code: number;
    message: string;
}

export type SkinType = {
    name: string;
};

export type SkinTypeView = {
    id: number;
    name: string;
};

export type CosmeticActionAdd = {
    name: string;
};

export interface Brand {
    name: string;
}

export interface BrandView extends Brand {
    id: number;
}

export type CosmeticActionView = {
    id: number;
    name: string;
};

export interface Catalog {
    id?: number;
    name: string;
    parentId?: number | null;
    children?: Catalog[];
}

export interface Cosmetic {
    name: string;
    description?: string;

    brandId: number;
    catalogId: number;

    keyIngredientIds: number[];
    actionIds: number[];
    skinTypeIds: number[];

    compatibility?: string;
    usageRecommendations?: string;
    applicationMethod?: string;

    imageUrls?: string[]; // URL-ы уже существующих изображений
    imageFiles?: File[];   // Новые изображения для загрузки
}

export type Ingredient = {
    name: string;
};

export type IngredientView = {
    id: number;
    name: string;
};