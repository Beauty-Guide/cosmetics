import "./index.css"
import "./i18"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import AppRoutes from "./routes.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./config/query-client.ts"
import { AuthProvider } from "./lib/AuthProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
