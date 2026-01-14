"use client"

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAlerts,
  selectAlerts,
  selectAllAlertsLoading,
} from "@/features/compliance/complianceSlice";

import { HeroTitle } from "@/components/ui/heroTitle";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getAlertsColumns, mapAPIAlertToMockAlert } from "@/models/complience";
import { ComplianceCard } from "@/components/compliance/complianceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { IconButton } from "@/components/ui/iconButton";
import { LinkButton } from "@/components/ui/linkButton";

export default function compliancePage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const alerts = useAppSelector(selectAlerts);
  const isLoading = useAppSelector(selectAllAlertsLoading);

  const [status, setStatus] = React.useState<string>("all");
  const [severidade, setSeveridade] = React.useState<string>("all");
  const [dataCriacaoInicio, setDataCriacaoInicio] = React.useState<Date | undefined>(undefined);
  const [dataCriacaoFim, setDataCriacaoFim] = React.useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = React.useState(false);

  const columns = React.useMemo(() => getAlertsColumns(), []);

  const displayAlerts = React.useMemo(() => {
    return alerts.map(mapAPIAlertToMockAlert);
  }, [alerts]);

  React.useEffect(() => {
    if (!token) return;

    const dataCriacaoInicioISO = dataCriacaoInicio ? dataCriacaoInicio.toISOString() : undefined;
    const dataCriacaoFimISO = dataCriacaoFim ? dataCriacaoFim.toISOString() : undefined;

    dispatch(
      fetchAlerts({
        token,
        status: status !== "all" ? (status as "Novo" | "EmAnalise" | "Resolvido") : undefined,
        severidade: severidade !== "all" ? (severidade as "Baixa" | "Media" | "Alta" | "Critica") : undefined,
        dataCriacaoInicio: dataCriacaoInicioISO,
        dataCriacaoFim: dataCriacaoFimISO,
      })
    );
  }, [token, dispatch, status, severidade, dataCriacaoInicio, dataCriacaoFim]);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        <div className="w-full relative">
          <img
            src="/banner-compliance.jpg"
            alt="Compliance"
            className="h-[240px] w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-start">
            <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
              <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full md:w-3/5 lg:w-2/5">
                <HeroTitle
                  as="h1"
                  subtitle="Monitoramento de Compliance e detecção proativa de riscos financeiros."
                >
                  Compliance
                </HeroTitle>
              </div>
            </div>
          </div>
        </div>


        <div className="flex flex-col max-w-[1554px] mx-auto px-4 md:px-8 py-8">
          <SectionTitle>Histórico de alertas</SectionTitle>
          <div className="w-full mb-6">
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
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Status
                      </label>
                      <Select value={status} onValueChange={setStatus}>
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
                        Severidade
                      </label>
                      <Select value={severidade} onValueChange={setSeveridade}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Media">Média</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Critica">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <DatePickerInput
                        disabled={false}
                        label="Data Criação Início"
                        value={dataCriacaoInicio}
                        onChange={setDataCriacaoInicio}
                        maxDate={dataCriacaoFim}
                        placeholder="dd/mm/aaaa"
                      />
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <DatePickerInput
                        disabled={false}
                        label="Data Criação Fim"
                        value={dataCriacaoFim}
                        onChange={setDataCriacaoFim}
                        minDate={dataCriacaoInicio}
                        placeholder="dd/mm/aaaa"
                      />
                    </div>

                    <LinkButton
                      variant="default"
                      size="small"
                      type="button"
                      onClick={() => {
                        setStatus("all");
                        setSeveridade("all");
                        setDataCriacaoInicio(undefined);
                        setDataCriacaoFim(undefined);
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
              data={displayAlerts}
              itemsPerPage={10}
              getRowKey={(alert) => alert.id}
              loading={isLoading}
              emptyMessage="Nenhum alerta encontrado"
              emptyDescription="Nenhum alerta encontrado para exibir. Altere os filtros para encontrar alertas ou entre em contato com o suporte. "
            />
          </div>
          <div className="block md:hidden">
            <CardTable
              data={displayAlerts}
              itemsPerPage={10}
              getRowKey={(alert) => alert.id}
              renderCard={(alert) => <ComplianceCard alert={alert} />}
              loading={isLoading}
              emptyMessage="Nenhum alerta encontrado"
              emptyDescription="Nenhum alerta encontrado para exibir. Altere os filtros para encontrar alertas ou entre em contato com o suporte. "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

