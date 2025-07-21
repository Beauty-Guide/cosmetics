import { AuthContext } from "@/config/auth-context"
import { useCurrentUser } from "@/hooks/getCurrentUser"
import type { TUser } from "@/types"

export const AuthProvider = ({ children }) => {
  const { data: user, refetch } = useCurrentUser()

  return (
    <AuthContext.Provider value={{ ...user, refetch } as TUser}>
      {children}
    </AuthContext.Provider>
  )
}
