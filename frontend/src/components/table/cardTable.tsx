"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { LayoutGrid } from "lucide-react";
import { renderPaginationItems } from "./paginationUtils";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export type CardTableProps<T> = {
  data: T[];
  itemsPerPage?: number;
  getRowKey?: (item: T, index: number) => string | number;
  renderCard: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  loading?: boolean;
};

export function CardTable<T>({
  data,
  itemsPerPage = 10,
  getRowKey,
  renderCard,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 gap-4",
  emptyMessage,
  emptyDescription,
  loading,
}: CardTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  if (data.length === 0 && !loading) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutGrid />
          </EmptyMedia>
          <EmptyTitle>{emptyMessage || "Nenhum dado disponível"}</EmptyTitle>
          <EmptyDescription>
            {emptyDescription || "Não há dados para exibir no momento. Refaça sua busca ou entre em contato com o suporte."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (loading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="gap-2">
            <CardHeader>
              <CardTitle className="text-lg">
                <Skeleton className="w-3/4 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-6 pb-4">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-12 h-3" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pb-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-16 h-3" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-12 h-3" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                </div>
                <div className="pt-4 border-t border-muted">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="w-24 h-3" />
                      <Skeleton className="w-32 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="w-24 h-3" />
                      <Skeleton className="w-32 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

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