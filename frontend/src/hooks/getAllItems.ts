import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllItems = async () => {
  const response = await axios.get(
    "http://localhost:8080/admin/cosmetic/getAllCosmetic"
  )
  return response.data
}

export const useGetAllItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchAllItems,
  })
}
