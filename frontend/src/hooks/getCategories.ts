import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchCategories = async () => {
  const response = await axios.get(
    "http://localhost:8080/admin/catalog/getAllCatalogs"
  )
  return response.data
}

export const useGetCategories = () => {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories })
}
