"use client";

import React from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
            src="/banner-transactions.jpg"
            alt="Transações"
            className="h-[240px] w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-start">
            <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
              <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full md:w-3/5 lg:w-2/5">
                <HeroTitle
                  as="h1"
                  subtitle="Administração de Depósitos, Transferências, Saques e Histórico Global."
                >
                  Transaçõess
                </HeroTitle>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Tabs defaultValue="transferencia" className="w-full">
            <TabsList className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
              <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
              <TabsTrigger value="deposito">Deposito</TabsTrigger>
              <TabsTrigger value="saque">Saque</TabsTrigger>
            </TabsList>
            <TabsContent value="transferencia" className="mt-4">
              <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
                {/* Transferencia content */}
                Teste
              </div>
            </TabsContent>
            <TabsContent value="deposito" className="mt-4">
              <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
                {/* Deposito content */}
                Teste
              </div>
            </TabsContent>
            <TabsContent value="saque" className="mt-4">
              <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
                {/* Saque content */}
                Teste
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md">
              <TriangleAlert className="size-5" />
              <p>{error}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
