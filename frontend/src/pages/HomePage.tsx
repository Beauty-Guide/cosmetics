import SideBar from "@/components/HomeComponents/SIdeBar"
import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <SideBar />
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl text-blue-500">Hello</h1>
        <Button variant="outline">Primary</Button>
      </div>
    </main>
  )
}

export default HomePage
