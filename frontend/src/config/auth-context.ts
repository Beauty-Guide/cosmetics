import type { TUser } from "@/types"
import { createContext, useContext } from "react"

export const AuthContext = createContext<TUser | null>(null)

export const useAuth = () => useContext(AuthContext)
