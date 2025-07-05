import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type TPaginationButtonsProps = {
  pages: number
  //   size: number
}

export function PaginationButtons({ pages }: TPaginationButtonsProps) {
  return (
    <Pagination className="py-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {Array.from({ length: pages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink href="#">{index}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
