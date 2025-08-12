import Providers from "./providers"
import AppRoutes from "./routes"

export function App() {
  return (
    <Providers>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </Providers>
  )
}

export default App
