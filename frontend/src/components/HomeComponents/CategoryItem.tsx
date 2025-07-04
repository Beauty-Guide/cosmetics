import { useState } from "react"

export default function CategoryItem({ category }) {
  const [open, setOpen] = useState<boolean>(false)

  const hasChildren = category.children && category.children.length > 0

  const handleClick = () => {
    console.log(category.name)
  }

  return (
    <div className="ml-4 mt-1">
      <div
        className="cursor-pointer flex items-center gap-1"
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && (
          <span className="text-gray-500">{open ? "▾" : "▸"}</span>
        )}
        <span className="hover:underline" onClick={handleClick}>
          {category.name}
        </span>
      </div>

      {hasChildren && open && (
        <div className="ml-4 border-l border-gray-300 pl-2 mt-1">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  )
}
