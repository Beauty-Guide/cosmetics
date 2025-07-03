import "./index.css"
import "./css/AdminPanel.css"
import "bootstrap/dist/css/bootstrap.min.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import AppRoutes from "./routes.tsx"
import AppNavbar from "./components/Navbar.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppNavbar />
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)
