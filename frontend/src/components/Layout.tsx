import { Outlet } from "react-router"
import AppNavbar from "./Navbar"
import { Toaster } from "./ui/sonner"
import Breadcrumbs from "./Breadcrumbs"

const Layout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <AppNavbar />
      <Breadcrumbs />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default Layout
