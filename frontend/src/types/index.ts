export type TProduct = {
  id: number
  name: string
  description: string
  compatibility: string
  usageRecommendations: string
  applicationMethod: string
  catalog: TCatalog
  brand: TBrand
  actions: TAction[]
  skinTypes: TSkinType[]
  ingredients: TIngredient[]
  img: string
}

type TCatalog = {
  id: number
  name: string
  parent: TCatalog | null
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
