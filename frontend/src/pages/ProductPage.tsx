import { ImageCarousel } from "@/components/ImageCarousel"
import { Badge } from "@/components/ui/badge"
import type { TProductPage } from "@/types"
import { useParams } from "react-router"

const product: TProductPage = {
  id: 1,
  name: "Low pH Good Morning Gel Cleanser",
  description: "Description",
  compatibility:
    "Нельзя сочетать с жесткими пиллингами или кислотами. Алкогольные тоники или агрессивные очищающие средства.",
  usageRecommendations:
    "Подходит для ежедневного использования утром и вечером.",
  applicationMethod:
    "Увлажните лицо теплой водой, вспените гель между руками и нанесите на лицо и мягко массируйте в течении 30-60 секунд особенно в Т-зоне. После смыть теплой водой",
  catalog: { id: 1, name: "Catalog name", parent: null },
  brand: { id: 1, name: "Dr. Jart+" },
  actions: [
    { id: 1, name: "Себорегуляция" },
    { id: 2, name: "Противоспалительное" },
    { id: 3, name: "Очищение" },
  ],
  skinTypes: [
    { id: 1, name: "Нормальный" },
    { id: 2, name: "Жирный" },
    { id: 3, name: "Комбинированный" },
  ],
  ingredients: [],
  imgs: [
    "https://placehold.co/600x400",
    "https://placehold.co/600x400",
    "https://placehold.co/600x400",
    "https://placehold.co/600x400",
  ],
}

const ProductPage = () => {
  const { id } = useParams()
  console.log(id)

  return (
    <main className="flex flex-col w-full items-center justify-center gap-5 p-4">
      <span className="flex flex-col items-start justify-center gap-2 my-2">
        <h1 className="text-3xl font-bold text-left">{product.name}</h1>
        <p className="">{product.brand.name}</p>
      </span>
      <div className="flex gap-15 max-md:flex-col">
        <div className="px-2">
          <ImageCarousel images={product.imgs} />
        </div>
        <div className="flex gap-6">
          <span className="flex flex-col items-start gap-2">
            <h2 className="mb-2 text-2xl max-md:text-xl font-bold">Действия</h2>
            {product.actions.map((action) => (
              <Badge
                key={action.id}
                variant="outline"
                className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
              >
                ✓ {action.name}
              </Badge>
            ))}
          </span>
          <span className="flex flex-col gap-2">
            <h2 className="mb-2 text-2xl max-md:text-xl font-bold">
              Типы кожи
            </h2>
            {product.skinTypes.map((skinType) => (
              <Badge
                key={skinType.id}
                variant="outline"
                className="flex items-center justify-start text-md max-md:text-sm font-bold w-60 h-12 max-md:w-45 max-md:h-10 rounded-2xl"
              >
                ✓ {skinType.name}
              </Badge>
            ))}
          </span>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            СОВМЕСТИМОСТЬ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.compatibility}
          </p>
        </span>
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            РЕКОМЕНДАЦИИ ПО ПРИМЕНЕНИЮ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.usageRecommendations}
          </p>
        </span>
        <span className="flex flex-col shadow-2xl p-4 rounded-xl">
          <h2 className="mb-1 text-xl max-md:text-lg font-bold">
            СПОСОБ ПРИМЕНЕНИЯ
          </h2>
          <p className="font-semibold max-md:text-sm">
            {product.applicationMethod}
          </p>
        </span>
      </div>
    </main>
  )
}

export default ProductPage
