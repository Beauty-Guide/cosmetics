import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchItemById = async (id: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/cosmetic/getCosmeticById/${id}`
  )
  return response.data
}

export const useItemById = (id: string) => {
  return useQuery({ queryKey: ["item", id], queryFn: () => fetchItemById(id) })
}
