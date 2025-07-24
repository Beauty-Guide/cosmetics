import { Button } from "@/components/ui/button"
import { Share2Icon } from "lucide-react"
import { Link } from "react-router"

const CosmeticBag = () => {
  const handleShare = () => {}

  return (
    <main className="flex flex-col items-center justify-center w-full h-full px-sides">
      <h1 className="text-xl font-bold text-black my-4 mr-auto">
        МОИ КОСМЕТИЧКИ
      </h1>

      <div className="flex items-center justify-start max-md:justify-center border border-black rounded-md px-2 w-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <span className="w-full flex items-center justify-between">
            <h1 className="text-sm font-bold text-gray-600">МОЯ КОСМЕТИЧКА</h1>
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={handleShare}
            >
              <Share2Icon />
            </Button>
          </span>
          <Link to="/cosmetic-bag/1" className="p-2">
            <img src="" alt="" className="" width={200} height={200} />
          </Link>
        </div>
      </div>
    </main>
  )
}

export default CosmeticBag
