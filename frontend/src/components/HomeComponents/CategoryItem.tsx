import { cn } from "@/lib/utils"
import { memo, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router"

interface TCategoryItem {
  id: number
  name: string
  children?: TCategoryItem[]
}

function CategoryItem({
  category,
  parentPath = "",
}: {
  category: TCategoryItem
  parentPath?: string
}) {
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()

  const fullPath = useMemo(
    () => `${parentPath}/${category.name}`,
    [parentPath, category.name]
  )

  const isActive = decodeURIComponent(location.pathname).startsWith(
    `/category${fullPath}`
  )
  const isSelected =
    decodeURIComponent(location.pathname) === `/category${fullPath}`

  const hasChildren = category.children && category.children.length > 0

  const handleClick = () => {
    navigate(`/category${fullPath}`)
  }

  useEffect(() => {
    if (isActive) {
      setOpen(true)
    }
  }, [isActive])

  return (
    <div className="ml-3 mt-2 relative group">
      <div
        className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${
          hasChildren ? "cursor-pointer hover:bg-gray-100" : ""
        }`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && (
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 text-gray-500 ${
              open ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        )}

        <span
          className={cn(
            "text-sm text-gray-800 hover:underline",
            isSelected && "text-blue-500"
          )}
          onClick={handleClick}
        >
          {category.name}
        </span>
      </div>

      {hasChildren && open && (
        <div className="ml-4 pl-2 border-l border-gray-300 transition-all duration-200">
          {category.children &&
            category.children.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                parentPath={fullPath}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default memo(CategoryItem)
