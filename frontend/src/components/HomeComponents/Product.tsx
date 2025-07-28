import { useNavigate } from "react-router"
import type { TProduct } from "@/types"
import { getImgUrl } from "@/lib/utils"
import { useAuth } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import FavoriteButton from "./FavoriteButton"
import AddProductToCosmeticBagModal from "../cosmeticBagComponents/modals/AddProductToCosmeticBagModal"
import { memo } from "react"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()
  const user = useAuth()
  const isAdmin = user?.role?.includes(ROLES.ADMIN)
  const isUser = user?.role?.includes(ROLES.USER)
  const isAuthenticated = isAdmin || isUser

  const navigateToItem = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div
      key={product.id}
      className="flex flex-col relative items-start justify-start mt-5 h-[420px] w-[460px] p-4 rounded-md shadow-md hover:shadow-xl overflow-hidden"
    >
      <img
        src={getImgUrl(product.images.find((img) => img.isMain)?.url)}
        alt={product.name}
        loading="lazy"
        className="max-h-[300px] max-md:max-w-[350px] max-w-[420px] rounded-md mx-auto"
        onClick={navigateToItem}
      />
      <span className="flex flex-col items-start justify-center mt-2">
        <h1 className="text-xl font-bold text-left">{product.name}</h1>
        <p className="">{product.brand.name}</p>
      </span>
      {isAuthenticated && (
        <span className="flex flex-col absolute top-8 right-5 max-md:top-2 max-md:right-2">
          <FavoriteButton productId={String(product.id)} />
          <AddProductToCosmeticBagModal cosmeticId={String(product.id)} />
        </span>
      )}
    </div>
  )
}

export default memo(Product)
