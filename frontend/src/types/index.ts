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
  images: TImage[]
  marketplaceLinks?: TMarkerLink[]
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

export type TImage = {
  id: string
  url: string
  isMain: boolean
}

type TIngredient = {
  id: number
  name: string
}

export type TRole = "ROLE_ADMIN" | "ROLE_USER" | "guest"

export type TUser = {
  name: string
  role: TRole
  history: TUserHistory[]
  refetch: () => void
}

export type TUserHistory = {
  id: number
  searchQuery: string
}

export type TMarkerLink = {
  id: string
  locale: string
  name: string
  url: string
}

export type TCosmeticBag = {
  id: string
  name: string
  ownerId: number
  likes: number
  createdAt: string
  cosmetics: TProduct[]
}
