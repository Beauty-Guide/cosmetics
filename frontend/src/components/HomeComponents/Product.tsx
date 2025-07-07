import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import type { TProduct } from "@/types"
import { useToggleFavProduct } from "@/hooks/useToggleFavProduct"
import { getImgUrl } from "@/lib/utils"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()

  const { mutate: toggleFav } = useToggleFavProduct()

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  const handleAddToFavorite = () => {
    toggleFav({ productId: String(product.id), action: "add" })
    console.log("Добавлено в избранное")
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
        <Button onClick={handleAddToFavorite}>Добавить в избранное</Button>
      </span>
    </div>
  )
}

export default Product
