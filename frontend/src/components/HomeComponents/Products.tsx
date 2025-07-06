import type { TProduct } from "@/types"
import { memo } from "react"
import Product from "./Product"
import { Skeleton } from "../ui/skeleton"

type TProductsProps = {
  products: TProduct[]
  isLoading: boolean
}

const Products = ({ products, isLoading }: TProductsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-start justify-start w-full flex-wrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            className="h-[300px] w-[450px] rounded-xl p-4 my-5 mx-2"
            key={index}
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <p className="p-4 text-muted-foreground">Ничего не найдено</p>
  }

  return (
    <div className="flex items-start justify-start w-full flex-wrap">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )
}

export default memo(Products)
