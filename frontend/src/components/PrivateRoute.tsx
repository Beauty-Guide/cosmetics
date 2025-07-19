import { useAuth } from "@/config/auth-context"
import type { TRole } from "@/types"
import { useNavigate } from "react-router"

const PrivateRoute: React.FC<{
  children: React.ReactNode
  allowedRoles: TRole[]
}> = ({ children, allowedRoles }) => {
  const user = useAuth()
  const navigate = useNavigate()
  const hasPermission = allowedRoles?.some((role) => user?.role.includes(role))

  if (!hasPermission && user) {
    navigate("/login", { replace: true })
    return
  }

  return <>{children}</>
}

export default PrivateRoute
