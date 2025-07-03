import { useNavigate } from "react-router"
import { Button } from "../ui/button"

const Item = ({ item }) => {
  const navigate = useNavigate()

  const navigateToItem = () => {
    navigate(`/item/${item.id}`)
  }

  return (
    <div
      key={item.id}
      className="flex flex-col items-center mt-5 mx-2 w-[400px] border-1 border-gray-400 p-4 rounded-md"
    >
      <img
        src={item.img || "https://placehold.co/600x400"}
        alt=""
        onClick={navigateToItem}
      />
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <span className="flex gap-4 items-center justify-center mt-5">
        <Button>Добавить в избранное</Button>
      </span>
    </div>
  )
}

export default Item
