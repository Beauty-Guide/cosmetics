export type Product = {
  id: number
  name: string
  description: string
  compatibility: string
  usageRecommendations: string
  applicationMethod: string
  catalog: Catalog
  brand: Brand
  actions: Action[]
  skinTypes: SkinType[]
  ingredients: Ingredient[]
}

type Catalog = {
  id: number
  name: string
  parent: Catalog | null
}

type Brand = {
  id: number
  name: string
}

type Action = {
  id: number
  name: string
}

type SkinType = {
  id: number
  name: string
}

type Ingredient = {
  any
}
