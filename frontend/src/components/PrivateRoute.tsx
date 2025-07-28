import { useAuth } from "@/config/auth-context"
import type { TRole } from "@/types"
import { useEffect } from "react"
import { useNavigate } from "react-router"

const PrivateRoute: React.FC<{
  children: React.ReactNode
  allowedRoles: TRole[]
}> = ({ children, allowedRoles }) => {
  const user = useAuth()
  const navigate = useNavigate()
  const hasPermission = allowedRoles?.some((role) => user?.role?.includes(role))

  useEffect(() => {
    if (!hasPermission && user) {
      navigate("/login", { replace: true })
      return
    }
  }, [navigate, hasPermission, user])

  return <>{children}</>
}

export default PrivateRoute
