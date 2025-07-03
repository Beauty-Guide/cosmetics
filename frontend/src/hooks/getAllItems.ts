import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllItems = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/cosmetic/getAllCosmetic`
  )
  return response.data
}

export const useGetAllItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchAllItems,
  })
}
