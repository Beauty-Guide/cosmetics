import type { TUser } from "@/types"
import { createContext, useContext } from "react"

const defaultValue = {
  username: "guest",
  role: "guest",
}

export const AuthContext = createContext<TUser>(defaultValue)

export const useAuth = () => useContext(AuthContext)
