import { Button } from "../ui/button"

const Item = ({ item }) => {
  return (
    <div
      key={item.id}
      className="flex flex-col items-center mt-5 mx-2 w-[400px] border-1 border-gray-400 p-4 rounded-md"
    >
      <img src={item.img || "https://placehold.co/600x400"} alt="" />
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <span className="flex gap-4 items-center justify-center mt-5">
        <p className="font-bold">{item.price} ₽</p>
        <Button>Добавить в корзину</Button>
      </span>
    </div>
  )
}

export default Item
