import { useGetAllFavProducts } from "@/hooks/getAllFavProducts"

const Favorites = () => {
  const { data: favourites, isLoading } = useGetAllFavProducts()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Favorites</h1>
      {favourites?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}

export default Favorites
