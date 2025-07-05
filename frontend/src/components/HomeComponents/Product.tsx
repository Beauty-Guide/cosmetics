import { useNavigate } from "react-router"
import { Button } from "../ui/button"
import { toast } from "sonner"
import type { TProduct } from "@/types"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  const handleAddToFavorite = () => {
    toast("Добавлено в избранное")
    console.log("Добавлено в избранное")
  }

  return (
    <div
      key={product.id}
      className="flex flex-col items-center mt-5 mx-2 w-[400px] border-1 border-gray-400 p-4 rounded-md shadow-sm hover:shadow-md"
    >
      <img
        src={product.imageUrl || "/600x400.svg"}
        alt=""
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
