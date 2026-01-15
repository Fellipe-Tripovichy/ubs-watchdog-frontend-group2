import * as React from "react";
import {
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export function createPaginationItem(
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

export function renderPaginationItems(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
): React.ReactNode[] {
  const items: React.ReactNode[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(createPaginationItem(i, currentPage, onPageChange));
    }
  } else {
    items.push(createPaginationItem(1, currentPage, onPageChange));

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(createPaginationItem(i, currentPage, onPageChange));
      }
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(createPaginationItem(totalPages, currentPage, onPageChange));
  }

  return items;
}
