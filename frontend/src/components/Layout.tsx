import { Outlet } from "react-router"
import AppNavbar from "./Navbar"
import { Toaster } from "./ui/sonner"
import Breadcrumbs from "./Breadcrumbs"

const Layout = () => {
  return (
    <div>
      <AppNavbar />
      <Breadcrumbs />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default Layout
