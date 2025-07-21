import { Outlet } from "react-router"
import Header from "./Header"
import { Toaster } from "./ui/sonner"
import Breadcrumbs from "./Breadcrumbs"

const Layout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <Breadcrumbs />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default Layout
