import { API_BASE_URL } from "@/config/consts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchAllSkinType = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/getAllSkinType`)
  return response.data
}

export const useGetAllSkinType = () =>
  useQuery({
    queryKey: ["skinType"],
    queryFn: fetchAllSkinType,
    staleTime: Infinity,
  })
