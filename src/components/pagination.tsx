import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function ArticlePagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center pt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>

          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            let pageNum;
            if (pageCount <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pageCount - 2) {
              pageNum = pageCount - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <Button variant={currentPage === pageNum ? "default" : "ghost"} onClick={() => onPageChange(pageNum)}>
                  {pageNum}
                </Button>
              </PaginationItem>
            );
          })}

          {pageCount > 5 && currentPage < pageCount - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext className={currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
