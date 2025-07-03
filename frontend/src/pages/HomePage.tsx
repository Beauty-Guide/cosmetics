import Item from "@/components/HomeComponents/Item"
import SideBar from "@/components/HomeComponents/SIdeBar"

const items = [
  {
    id: 1,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
  {
    id: 2,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
  {
    id: 3,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
  {
    id: 4,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
  {
    id: 5,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
  {
    id: 6,
    name: "Крем",
    img: null,
    description: "Крем для лица",
    price: 100,
  },
]

const HomePage = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <SideBar />
      <div className="flex items-center justify-center w-full flex-wrap">
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}

export default HomePage
