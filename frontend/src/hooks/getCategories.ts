import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchCategories = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/catalog/getAllCatalogs`
  )
  return response.data
}

export const useGetCategories = () => {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories })
}
