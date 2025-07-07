import type { TProduct } from "@/types"

type TFavoriteItemProps = {
  product: TProduct
}

const FavoriteItem = ({ product }: TFavoriteItemProps) => {
  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  )
}

export default FavoriteItem
