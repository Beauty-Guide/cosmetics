import { AuthContext } from "@/config/auth-context"
import { ROLES } from "@/config/consts"
import { useCurrentUser } from "@/hooks/getCurrentUser"
import type { TUser } from "@/types"

export const AuthProvider = ({ children }) => {
  const { data: user, refetch } = useCurrentUser()
  const isAdmin = user?.role?.includes(ROLES.ADMIN)
  const isUser = user?.role?.includes(ROLES.USER)
  const isSeller = user?.role?.includes(ROLES.SELLER)
  const isAuthenticated = isAdmin || isUser

  return (
    <AuthContext.Provider
      value={{ ...user, refetch, isAdmin, isSeller, isUser, isAuthenticated } as TUser}
    >
      {children}
    </AuthContext.Provider>
  )
}
