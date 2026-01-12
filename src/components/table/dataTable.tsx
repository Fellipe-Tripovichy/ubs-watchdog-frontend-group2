"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { renderPaginationItems } from "./paginationUtils";

export type ColumnDef<T> = {
  key: string;
  label: string | React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  accessor?: keyof T | ((item: T) => any);
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  itemsPerPage?: number;
  getRowKey?: (item: T, index: number) => string | number;
};

export function DataTable<T>({
  columns,
  data,
  itemsPerPage = 10,
  getRowKey,
}: DataTableProps<T>) {
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

  // Render cell content
  const renderCell = React.useCallback(
    (column: ColumnDef<T>, item: T, index: number) => {
      if (column.render) {
        return column.render(item, index);
      }

      if (column.accessor) {
        if (typeof column.accessor === "function") {
          return column.accessor(item);
        } else {
          return String(item[column.accessor] ?? "");
        }
      }

      return null;
    },
    []
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.headerClassName || column.className}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow key={getKey(item, index)}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={column.className}
                >
                  {renderCell(column, item, startIndex + index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
