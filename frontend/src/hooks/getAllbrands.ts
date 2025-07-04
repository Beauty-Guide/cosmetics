import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/brand/getAllBrand`)
  return response.data
}

export const useGetAllBrands = () => {
  return useQuery({ queryKey: ["brands"], queryFn: fetchAllBrands })
}
