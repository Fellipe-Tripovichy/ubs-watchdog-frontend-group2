"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type CardTableProps<T> = {
  data: T[];
  itemsPerPage?: number;
  getRowKey?: (item: T, index: number) => string | number;
  renderCard: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
};

function createPaginationItem(
  pageNumber: number,
  currentPage: number,
  onPageChange: (page: number) => void
): React.ReactNode {
  return (
    <PaginationItem key={pageNumber}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onPageChange(pageNumber);
        }}
        isActive={currentPage === pageNumber}
        className="cursor-pointer"
      >
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );
}

function renderPaginationItems(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) {
  const items: React.ReactNode[] = [];

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      items.push(createPaginationItem(i, currentPage, onPageChange));
    }
  } else {
    // Always show first page
    items.push(createPaginationItem(1, currentPage, onPageChange));

    // Show ellipsis after first page if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(createPaginationItem(i, currentPage, onPageChange));
      }
    }

    // Show ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(createPaginationItem(totalPages, currentPage, onPageChange));
  }

  return items;
}

export function CardTable<T>({
  data,
  itemsPerPage = 10,
  getRowKey,
  renderCard,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 gap-4",
}: CardTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Default row key function
  const getKey = React.useCallback(
    (item: T, index: number) => {
      if (getRowKey) {
        return getRowKey(item, index);
      }
      return startIndex + index;
    },
    [getRowKey, startIndex]
  );

  return (
    <>
      <div className={gridClassName}>
        {paginatedData.map((item, index) => (
          <React.Fragment key={getKey(item, index)}>
            {renderCard(item, startIndex + index)}
          </React.Fragment>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems(currentPage, totalPages, setCurrentPage)}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}