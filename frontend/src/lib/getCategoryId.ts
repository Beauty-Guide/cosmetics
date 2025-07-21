import type { TCategory } from "@/types"

const getCategoryId = (categories: TCategory[], pathname: string): string => {
  const id =
    categories.find(
      (c) => c.name === decodeURIComponent(pathname.split("/").at(-1) || "")
    )?.id || ""

  return String(id)
}

export default getCategoryId
