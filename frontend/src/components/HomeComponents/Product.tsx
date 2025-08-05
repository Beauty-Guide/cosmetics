import { useNavigate } from "react-router"
import type { TProduct } from "@/types"
import { getImgUrl } from "@/lib/utils"
import { useAuth } from "@/config/auth-context"
import { memo } from "react"
import ProductOptions from "./ProductOptions"

type ProductProps = {
  product: TProduct
}

const Product = ({ product }: ProductProps) => {
  const navigate = useNavigate()
  const user = useAuth()

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
      {user?.isAuthenticated && (
        <div className="flex flex-col absolute top-5 right-5 max-md:top-3 max-md:right-3">
          <ProductOptions
            productId={String(product.id)}
            prodactName={product.name}
          />
        </div>
      )}
    </div>
  )
}

export default memo(Product)
