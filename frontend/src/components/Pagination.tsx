import { Button } from "@/components/ui/button"
import React, { memo, useMemo } from "react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
}

type PageNumber = number | "..."

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const pages: PageNumber[] = useMemo(() => {
    if (totalPages === 0) return []

    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const showLeftDots = leftSiblingIndex > boundaryCount + 2
    const showRightDots = rightSiblingIndex < totalPages - boundaryCount - 1

    const leftPages = range(1, boundaryCount)
    const rightPages = range(totalPages - boundaryCount + 1, totalPages)

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, rightSiblingIndex + boundaryCount)
      return [...leftRange, "...", ...rightPages]
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(leftSiblingIndex - boundaryCount, totalPages)
      return [...leftPages, "...", ...rightRange]
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [...leftPages, "...", ...middleRange, "...", ...rightPages]
    }

    return range(1, totalPages)
  }, [totalPages, currentPage, siblingCount, boundaryCount])

  if (pages.length === 0) return null

  const onPrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }
  const onNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-10 max-md:pb-12">
      <Button
        onClick={onPrev}
        disabled={currentPage === 1}
        size="sm"
        variant="outline"
      >
        {"<"}
      </Button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="select-none px-2">
            ...
          </span>
        ) : (
          <Button
            key={idx}
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            size="sm"
          >
            {page}
          </Button>
        )
      )}

      <Button
        onClick={onNext}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        {">"}
      </Button>
    </div>
  )
}

export default memo(Pagination)
