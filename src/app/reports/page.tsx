"use client";

import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAllReports,
  selectAllReports,
  selectAllReportsLoading,
  selectReportsError,
} from "@/features/reports/reportsSlice";

import { Spinner } from "@/components/ui/spinner";
import { isoToDate, dateToISO, startOfCurrentMonthISO, todayISO } from "@/lib/utils";
import { InfoIcon, TriangleAlert } from "lucide-react";
import { HeroTitle } from "@/components/ui/heroTitle";
import { LinkButton } from "@/components/ui/linkButton";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { IconButton } from "@/components/ui/iconButton";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getReportsColumns } from "@/models/reports";
import { ReportCard } from "@/components/reports/reportCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const allReports = useAppSelector(selectAllReports);
  const isLoading = useAppSelector(selectAllReportsLoading);
  const error = useAppSelector(selectReportsError);

  const [startDate, setStartDate] = React.useState<string>(
    startOfCurrentMonthISO()
  );
  const [endDate, setEndDate] = React.useState<string>(todayISO());
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    if (!startDate) return;
    if (!endDate) setEndDate(todayISO());
  }, [startDate, endDate]);

  React.useEffect(() => {
    if (!startDate || !endDate) return;
    if (endDate < startDate)
      setEndDate(todayISO() >= startDate ? todayISO() : startDate);
  }, [startDate, endDate]);

  const isValidRange =
    Boolean(startDate) && Boolean(endDate) && endDate >= startDate;

  const columns = React.useMemo(() => getReportsColumns(), []);

  React.useEffect(() => {
    if (!token || !isValidRange) return;

    dispatch(
      fetchAllReports({
        token,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    );
  }, [token, dispatch, startDate, endDate, isValidRange]);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        <div className="w-full relative">
          <img
            src="/banner-reports.jpg"
            alt="UBS Watchdog"
            className="h-[240px] w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-start">
            <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
              <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full md:w-3/5 lg:w-2/5">
                <HeroTitle
                  as="h1"
                  subtitle="Visão geral da carteira. Selecione um cliente para detalhar perfil, transações e alertas."
                >
                  Relatórios
                </HeroTitle>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1554px] mx-auto px-4 md:px-8 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center justify-end block md:hidden">
              <IconButton icon={showFilters ? "x" : "filter"} variant="secondary" size="small" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "text-foreground bg-muted" : ""}/>
            </div>
          </div>
          {(() => {
            const filterContent = (
              <>
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
                  <div className="flex-1 w-full md:max-w-[172px]">
                    <DatePickerInput
                      label="Data inicial"
                      value={isoToDate(startDate)}
                      maxDate={isoToDate(todayISO())}
                      onChange={(d) => {
                        const nextStart = d
                          ? dateToISO(d)
                          : startOfCurrentMonthISO();
                        setStartDate(nextStart);

                        const today = todayISO();
                        if (!endDate || endDate < nextStart)
                          setEndDate(today >= nextStart ? today : nextStart);
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full md:max-w-[172px]">
                    <DatePickerInput
                      label="Data final"
                      value={isoToDate(endDate)}
                      minDate={isoToDate(startDate)}
                      maxDate={isoToDate(todayISO())}
                      onChange={(d) => {
                        const nextEnd = d != null ? dateToISO(d) : todayISO();
                        setEndDate(nextEnd);
                      }}
                    />
                  </div>

                  <LinkButton
                    variant="default"
                    size="small"
                    type="button"
                    onClick={() => {
                      setStartDate(startOfCurrentMonthISO());
                      setEndDate(todayISO());
                    }}
                  >
                    Redefinir período
                  </LinkButton>
                </div>
              </>
            );

            return (
              <>
                {showFilters && (
                  <div className="flex flex-col gap-2 mt-4 block md:hidden">
                    {filterContent}
                  </div>
                )}
                <div className="flex flex-col gap-2 mt-4 hidden md:block">
                  {filterContent}
                </div>
              </>
            );
          })()}
        </div>
        <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md">
              <TriangleAlert className="size-5" />
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : allReports.length > 0 ? (
            <>
              <div className="w-full hidden md:block">
                <DataTable
                  columns={columns}
                  data={allReports}
                  itemsPerPage={10}
                  getRowKey={(report) => report.client.id}
                />
              </div>
              <div className="block md:hidden">
                <CardTable
                  data={allReports}
                  itemsPerPage={10}
                  getRowKey={(report) => report.client.id}
                  renderCard={(report) => <ReportCard report={report} />}
                />
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <InfoIcon className="size-8 mb-2" />
                <p>Nenhum relatório encontrado</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
