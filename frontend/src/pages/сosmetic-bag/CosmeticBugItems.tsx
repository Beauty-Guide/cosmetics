import { useLocation } from "react-router"

const CosmeticBugItems = () => {
  const { pathname } = useLocation()
  return (
    <main className="flex flex-col items-center justify-center gap-2 w-full h-full px-sides">
      <h1>{pathname}</h1>
      <div className="flex items-center justify-center border border-black rounded-md p-3 w-full">
        <h1 className="text-left">Моя Косметичка</h1>
      </div>
    </main>
  )
}

export default CosmeticBugItems
