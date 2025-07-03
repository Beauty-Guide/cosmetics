import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllItems = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  )
  return response.data
}

export const useGetAllItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchAllItems,
  })
}
