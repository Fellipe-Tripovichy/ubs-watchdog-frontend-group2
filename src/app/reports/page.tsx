"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAllReports,
  selectAllReports,
  selectAllReportsLoading,
} from "@/features/reports/reportsSlice";

import { HeroTitle } from "@/components/ui/heroTitle";
import { LinkButton } from "@/components/ui/linkButton";
import { IconButton } from "@/components/ui/iconButton";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getReportsColumns } from "@/models/reports";
import { ReportCard } from "@/components/reports/reportCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const allReports = useAppSelector(selectAllReports);
  const isLoading = useAppSelector(selectAllReportsLoading);

  const [statusAlerta, setStatusAlerta] = React.useState<string>("all");
  const [statusKyc, setStatusKyc] = React.useState<string>("all");
  const [pais, setPais] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);
  const [allCountries, setAllCountries] = React.useState<string[]>([]);
  const countriesFetchedRef = React.useRef(false);

  const columns = React.useMemo(() => getReportsColumns(), []);

  React.useEffect(() => {
    if (!token || countriesFetchedRef.current) return;
    dispatch(
      fetchAllReports({
        token,
        statusAlerta: undefined,
        statusKyc: undefined,
        pais: undefined,
      })
    ).then((action) => {
      if (fetchAllReports.fulfilled.match(action) && action.payload) {
        const uniqueCountries = Array.from(
          new Set(action.payload.map((report) => report.pais).filter(Boolean))
        );
        setAllCountries(uniqueCountries.sort());
        countriesFetchedRef.current = true;
      }
    });
  }, [token, dispatch]);

  React.useEffect(() => {
    if (!token) return;

    dispatch(
      fetchAllReports({
        token,
        statusAlerta: statusAlerta !== "all" ? statusAlerta : undefined,
        statusKyc: statusKyc !== "all" ? statusKyc : undefined,
        pais: pais !== "all" ? pais : undefined,
      })
    );
  }, [token, dispatch, statusAlerta, statusKyc, pais]);

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
        <div className="flex flex-col gap-2 max-w-[1554px] mx-auto px-4 md:px-8 py-8">
          <SectionTitle>Histórico de relatórios</SectionTitle>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              <div className="flex items-center justify-end block md:hidden">
                <IconButton icon={showFilters ? "x" : "filter"} variant="secondary" size="small" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "text-foreground bg-muted" : ""} />
              </div>
            </div>
            {(() => {
              const filterContent = (
                <>
                  <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
                    <div className="flex-1 w-full md:max-w-[172px]">
                      <div className="flex items-start gap-2">
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Status Alerta
                        </label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help w-fit">
                              <InfoIcon className="size-3.5 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs text-muted-foreground p-2">Filtre os relatórios por status de alerta, pare ter acesso as quais alertas cadda relatório possui.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select value={statusAlerta} onValueChange={setStatusAlerta}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Novo">Novo</SelectItem>
                          <SelectItem value="EmAnalise">Em Análise</SelectItem>
                          <SelectItem value="Resolvido">Resolvido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Status KYC
                      </label>
                      <Select value={statusKyc} onValueChange={setStatusKyc}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        País
                      </label>
                      <Select value={pais} onValueChange={setPais}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {allCountries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <LinkButton
                      variant="default"
                      size="small"
                      type="button"
                      onClick={() => {
                        setStatusAlerta("all");
                        setStatusKyc("all");
                        setPais("all");
                      }}
                    >
                      Limpar filtros
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
          <div className="w-full hidden md:block">
            <DataTable
              columns={columns}
              data={allReports}
              itemsPerPage={10}
              getRowKey={(report) => report.clienteId}
              loading={isLoading}
              emptyMessage="Nenhum relatório encontrado"
              emptyDescription="Nenhum relatório encontrado para exibir. Altere os filtros para encontrar relatórios ou entre em contato com o suporte. "
            />
          </div>
          <div className="block md:hidden">
            <CardTable
              data={allReports}
              itemsPerPage={10}
              getRowKey={(report) => report.clienteId}
              renderCard={(report) => <ReportCard report={report} />}
              loading={isLoading}
              emptyMessage="Nenhum relatório encontrado"
              emptyDescription="Nenhum relatório encontrado para exibir. Altere os filtros para encontrar relatórios ou entre em contato com o suporte. "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
