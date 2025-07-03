import { useParams } from "react-router"

const ItemPage = () => {
  const { id } = useParams()

  return <main>ItemPage {id}</main>
}

export default ItemPage
