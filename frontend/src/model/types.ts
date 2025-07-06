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
    name: string;
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

export interface Catalog1 {
    id: number;
    name: string;
    parent: Catalog | null;
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

export type CosmeticResponse = {
    id: number;
    name: string;
    description: string;
    compatibility: string;
    usageRecommendations: string;
    applicationMethod: string;
    catalog: Catalog1;
    brand: BrandView;
    actions: CosmeticActionView[];
    skinTypes: SkinTypeView[];
    ingredients: IngredientView[];
    images: ImageResponse[];
};

export type CosmeticsResponse = {
    total: number;
    cosmetics: CosmeticResponse[];
};

export type ImageResponse = {
    id: string;
    url: string;
    isMain: boolean;
};


export type Ingredient = {
    name: string;
};

export type IngredientView = {
    id: number;
    name: string;
};