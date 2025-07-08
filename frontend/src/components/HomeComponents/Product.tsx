import { useNavigate } from "react-router"
import type { TProduct } from "@/types"
import { getImgUrl } from "@/lib/utils"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import FavoriteButton from "./FavoriteButton"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()
  const user = useAuth()
  const isAdmin = user?.role.includes(ROLES.ADMIN)
  const isUser = user?.role.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div
      key={product.id}
      className="flex flex-col relative items-center mt-5 h-[400px] w-[450px] p-4 rounded-md shadow-md hover:shadow-xl"
    >
      <img
        src={getImgUrl(product.images.find((img) => img.isMain)?.url)}
        alt=""
        className="h-[300px] w-[450px] rounded-md"
        onClick={navigateToItem}
      />
      <h1>{product.name}</h1>
      {isAuthenticated && (
        <span className="flex absolute top-8 right-5 max-md:top-2 max-md:right-2">
          <FavoriteButton productId={String(product.id)} />
        </span>
      )}
    </div>
  )
}

export default Product
