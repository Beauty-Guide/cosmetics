export type TProduct = {
  id: number
  name: string
  description: string
  compatibility: string
  usageRecommendations: string
  applicationMethod: string
  catalog: TCategory
  brand: TBrand
  actions: TAction[]
  skinTypes: TSkinType[]
  ingredients: TIngredient[]
  imageUrl: string
}

export type TProductPage = Omit<TProduct, "img"> & {
  imageUrls: string[]
}

export type TCategory = {
  id: number
  name: string
  parent: TCategory | null
}

type TBrand = {
  id: number
  name: string
}

type TAction = {
  id: number
  name: string
}

type TSkinType = {
  id: number
  name: string
}

type TIngredient = {
  any
}
