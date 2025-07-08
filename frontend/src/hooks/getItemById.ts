import { API_BASE_URL } from "@/config/consts"
import type { TProduct } from "@/types"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchItemById = async (id: string): Promise<TProduct> => {
  const response = await axios.get(`${API_BASE_URL}/api/getCosmeticsById/${id}`)
  return response.data
}

export const useItemById = (id: string) => {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => fetchItemById(id),
    staleTime: 30000,
  })
}
