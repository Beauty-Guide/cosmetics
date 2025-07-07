import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import AppRoutes from "./routes.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./config/query-client.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
