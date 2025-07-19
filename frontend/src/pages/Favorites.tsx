import FavoriteItem from "@/components/FavoritesPageComponents/FavoriteItem"
import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"
import { useTranslation } from "react-i18next"

const Favorites = () => {
  const { t } = useTranslation()
  const { data: favourites, isLoading } = useGetAllFavProducts()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-start justify-start w-full p-4 px-sides">
      <h1 className="text-2xl font-semibold text-left select-none my-2">
        {t("favorites")}
      </h1>
      {favourites?.map((product) => (
        <FavoriteItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default Favorites
