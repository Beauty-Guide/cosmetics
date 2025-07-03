import { useParams } from "react-router"

const ProductPage = () => {
  const { id } = useParams()

  return <main>ProductPage {id}</main>
}

export default ProductPage
