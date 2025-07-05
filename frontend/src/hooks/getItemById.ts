import { API_BASE_URL } from "@/config/consts"
import type { TProductPage } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchItemById = async (id: string): Promise<TProductPage> => {
  const response = await axios.get(`${API_BASE_URL}/api/getCosmeticsById/${id}`)
  return response.data
}

export const useItemById = (id: string) => {
  return useQuery({ queryKey: ["item", id], queryFn: () => fetchItemById(id) })
}
