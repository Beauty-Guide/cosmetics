import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import type { TProduct } from "@/types"
import { useToggleFavProduct } from "@/hooks/useToggleFavProduct"
import { getImgUrl } from "@/lib/utils"
import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"
import { useMemo } from "react"
import { Skeleton } from "../ui/skeleton"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()
  const { data: favourites, isLoading } = useGetAllFavProducts()
  const { mutate: toggleFav, isPending: isToggleLoading } =
    useToggleFavProduct()

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  const handleAddToFavorite = () => {
    toggleFav({ productId: String(product.id), action: "add" })
  }

  const handleRemoveFromFavorite = () => {
    toggleFav({ productId: String(product.id), action: "remove" })
  }

  const isFavorite = useMemo(() => {
    return favourites?.some((fav) => fav.id === product.id)
  }, [favourites, product.id])

  const favoriteBtn = () => {
    if (isLoading) {
      return <Skeleton className="h-[36px] w-[160px] rounded-md" />
    }
    if (isFavorite) {
      return (
        <Button onClick={handleRemoveFromFavorite} disabled={isToggleLoading}>
          Удалить из избранного
        </Button>
      )
    } else {
      return (
        <Button onClick={handleAddToFavorite} disabled={isToggleLoading}>
          Добавить в избранное
        </Button>
      )
    }
  }

  return (
    <div
      key={product.id}
      className="flex flex-col items-center mt-5 w-[450px] border-gray-400 p-4 rounded-md shadow-md hover:shadow-xl"
    >
      <img
        src={getImgUrl(product.images.find((img) => img.isMain)?.url)}
        alt=""
        className="h-[300px] w-[450px] rounded-md"
        onClick={navigateToItem}
      />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span className="flex gap-4 items-center justify-center mt-5">
        {favoriteBtn()}
      </span>
    </div>
  )
}

export default Product
