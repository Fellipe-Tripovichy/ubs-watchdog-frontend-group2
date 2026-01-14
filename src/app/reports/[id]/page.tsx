"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import { fetchClientReport, selectCurrentReport, selectReportLoading } from "@/features/reports/reportsSlice";
import {
    fetchClientTransactions,
    selectClientTransactions,
    selectClientTransactionsLoading,
    selectTransactionsError,
} from "@/features/transactions/transactionsSlice";
import {
    fetchAlerts,
    selectAlerts,
    selectAllAlertsLoading,
    selectComplianceError,
} from "@/features/compliance/complianceSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColorByStatus, formatMoney, isoToDate, dateToISO, startOfCurrentMonthISO, todayISO, formatDate } from "@/lib/utils";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { CheckCircle2Icon, InfoIcon, TriangleAlert } from "lucide-react"
import Link from "next/link";

import { SectionTitle } from "@/components/ui/sectionTitle";
import { FlagImage } from "@/components/ui/flagImage";
import { HeroTitle } from "@/components/ui/heroTitle";
import { IconButton } from "@/components/ui/iconButton";
import { CopyButton } from "@/components/ui/copyButton";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getTransactionsColumns } from "@/models/transactions";
import { mapAPIAlertToMockAlert, getAlertsColumns } from "@/models/complience";
import type { Severidade } from "@/types/compliance";
import { TransactionCard } from "@/components/transactions/transactionCard";
import { ComplianceCard } from "@/components/compliance/complianceCard";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

type AlertSeverity = "Baixa" | "Média" | "Alta" | "Crítica";
type TransactionType = "Depósito" | "Saque" | "Transferência";

function mapSeveridadeToAlertSeverity(severidade: Severidade): AlertSeverity {
    const map: Record<Severidade, AlertSeverity> = {
        Baixa: "Baixa",
        Media: "Média",
        Alta: "Alta",
        Critica: "Crítica",
    };
    return map[severidade];
}

function getSeverityPieColor(severity: AlertSeverity): string {
    const statusMap: Record<AlertSeverity, string> = {
        Crítica: "critical",
        Alta: "high",
        Média: "medium",
        Baixa: "low",
    };
    return getColorByStatus(statusMap[severity]).base;
}

function createBadgeStyle<T extends string>(statusMap: Record<T, string>, value: T) {
    const colors = getColorByStatus(statusMap[value]);
    return {
        backgroundColor: colors.light,
        color: colors.foreground,
    };
}

function getBadgeStyleByRisk(risk: string) {
    const statusMap: Record<string, string> = {
        "Baixo": "low",
        "Médio": "medium",
        "Alto": "high",
    };
    return createBadgeStyle(statusMap, risk);
}

function getBadgeStyleByKyc(kyc: string) {
    const statusMap: Record<string, string> = {
        "Aprovado": "approved",
        "Pendente": "pending",
        "Rejeitado": "rejected",
    };
    return createBadgeStyle(statusMap, kyc);
}

export default function ReportsPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const report = useAppSelector(selectCurrentReport);
    const isLoadingReport = useAppSelector(selectReportLoading);
    const clientTransactions = useAppSelector(selectClientTransactions);
    const isLoadingTransactions = useAppSelector(selectClientTransactionsLoading);
    const transactionsError = useAppSelector(selectTransactionsError);
    const alerts = useAppSelector(selectAlerts);
    const isLoadingAlerts = useAppSelector(selectAllAlertsLoading);
    const alertsError = useAppSelector(selectComplianceError);

    const clientId = React.useMemo(() => {
        const id = params?.id as string;
        return id ? id.toUpperCase() : "C-1023";
    }, [params?.id]);

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

    React.useEffect(() => {
        if (!clientId || !token || !isValidRange) return;

        dispatch(fetchClientReport({
            clientId,
            token,
            dataInicio: startDate || undefined,
            dataFim: endDate || undefined,
        }));
    }, [clientId, token, startDate, endDate, dispatch, isValidRange]);

    React.useEffect(() => {
        if (!clientId || !token || !isValidRange) return;

        dispatch(fetchClientTransactions({
            clientId,
            token,
            dataInicio: startDate || undefined,
            dataFim: endDate || undefined,
        }));
    }, [clientId, token, startDate, endDate, dispatch, isValidRange]);

    React.useEffect(() => {
        if (!clientId || !token || !isValidRange) return;

        dispatch(fetchAlerts({
            token,
            clienteId: clientId,
            dataCriacaoInicio: startDate || undefined,
            dataCriacaoFim: endDate || undefined,
            dataResolucao: undefined,
            severidade: undefined,
            status: undefined,
        }));
    }, [clientId, token, startDate, endDate, dispatch, isValidRange]);

    const currencies = React.useMemo(() => {
        if (!clientTransactions || clientTransactions.length === 0) return [];
        const set = new Set(clientTransactions.map((t) => t.moeda));
        return Array.from(set) as ("BRL" | "USD" | "EUR")[];
    }, [clientTransactions]);

    const [selectedCurrency, setSelectedCurrency] = React.useState<"BRL" | "USD" | "EUR">("BRL");

    React.useEffect(() => {
        const next = currencies[0] ?? "BRL";
        if (!currencies.includes(selectedCurrency)) setSelectedCurrency(next);
    }, [currencies, selectedCurrency]);

    const txInCurrency = React.useMemo(() => {
        if (!clientTransactions || clientTransactions.length === 0) return [];
        return clientTransactions.filter((t) => t.moeda === selectedCurrency);
    }, [clientTransactions, selectedCurrency]);

    const totalMovedSelectedCurrency = React.useMemo(() => {
        return txInCurrency.reduce((acc, t) => acc + t.valor, 0);
    }, [txInCurrency]);

    const totalsByCurrency = React.useMemo(() => {
        if (!clientTransactions || clientTransactions.length === 0) return [];
        const map = new Map<string, number>();
        for (const t of clientTransactions) {
            map.set(t.moeda, (map.get(t.moeda) ?? 0) + t.valor);
        }
        return Array.from(map.entries()).map(([currency, total]) => ({
            currency,
            total,
        }));
    }, [clientTransactions]);

    const totalsByType = React.useMemo(() => {
        const types: TransactionType[] = ["Depósito", "Saque", "Transferência"];
        const map: Record<TransactionType, { count: number; total: number }> = {
            Depósito: { count: 0, total: 0 },
            Saque: { count: 0, total: 0 },
            Transferência: { count: 0, total: 0 },
        };

        const typeMapping: Record<string, TransactionType> = {
            Deposito: "Depósito",
            Transferencia: "Transferência",
            Saque: "Saque",
            
            Depósito: "Depósito",
            Transferência: "Transferência",
        };

        for (const tx of txInCurrency) {
            const normalizedType = typeMapping[tx.tipo];
            if (normalizedType && map[normalizedType]) {
                map[normalizedType].count += 1;
                map[normalizedType].total += tx.valor;
            }
        }

        return types.map((type) => ({
            type,
            count: map[type].count,
            total: map[type].total,
            average: map[type].count ? map[type].total / map[type].count : 0,
        }));
    }, [txInCurrency]);

    const barData = totalsByType.map((x) => ({ name: x.type, total: x.total }));

    const alertsBySeverity = React.useMemo(() => {
        const order: AlertSeverity[] = ["Crítica", "Alta", "Média", "Baixa"];
        const map: Record<AlertSeverity, number> = {
            Crítica: 0,
            Alta: 0,
            Média: 0,
            Baixa: 0,
        };
        
        alerts.forEach((apiAlert) => {
            const mappedAlert = mapAPIAlertToMockAlert(apiAlert);
            const alertSeverity = mapSeveridadeToAlertSeverity(mappedAlert.severity);
            map[alertSeverity] = (map[alertSeverity] || 0) + 1;
        });
        
        return order
            .map((sev) => ({ name: sev, value: map[sev] }))
            .filter((x) => x.value > 0);
    }, [alerts]);

    return (
        <div className="flex flex-col items-start w-full">
            <div className="w-full">
                <div className="w-full flex items-center jsustify-start">
                    <div className="flex flex-col items-start justify-start w-full max-w-[1554px] mx-auto">
                        <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full">
                            <LinkButton icon="chevron-left" iconLeft={true} asChild className="mb-4">
                                <Link href="/reports">Voltar</Link>
                            </LinkButton>
                            <HeroTitle as="h1" subtitle="Visão consolidada de perfil, transações e alertas. Filtre por período para detalhar os dados.">Relatório do cliente</HeroTitle>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1554px] mx-auto px-4 md:px-8 mt-8">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center justify-end block md:hidden">
                            <IconButton icon={showFilters ? "x" : "filter"} variant="secondary" size="small" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "text-foreground bg-muted" : ""} />
                        </div>
                    </div>
                    {(() => {
                        const filterContent = (
                            <>
                                <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
                                    <div className="flex-1 w-full md:max-w-[172px]">
                                        <span className="text-sm text-muted-foreground">Moeda</span>
                                        <Select
                                            disabled={isLoadingReport}
                                            value={selectedCurrency}
                                            onValueChange={(value) => setSelectedCurrency(value as "BRL" | "USD" | "EUR")}
                                        >
                                            <SelectTrigger className="mt-1 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 w-full md:max-w-[172px]">
                                        <DatePickerInput
                                            disabled={isLoadingReport}
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
                                            disabled={isLoadingReport}
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
                                        disabled={isLoadingReport}
                                        variant="default"
                                        size="small"
                                        type="button"
                                        onClick={() => {
                                            setStartDate(startOfCurrentMonthISO());
                                            setEndDate(todayISO());
                                        }}
                                    >
                                        Redefinir filtros
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
                <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8 gap-20">

                        <div className="w-full">
                            <SectionTitle>
                                Informações gerais
                            </SectionTitle>
                            {
                                isLoadingReport ? (
                                    <Skeleton className="w-full h-18 mb-6" />
                                ) : (
                                    <>
                                        {
                                            (report?.totalAlertas ?? 0) > 0 ? (
                                                <div className="flex items-center justify-start gap-6 bg-secondary p-6 rounded-md mb-6 bg-warning-light">
                                                    <TriangleAlert className="min-h-6 min-w-6 size-6 text-warning-foreground" />
                                                    <p className="text-body text-warning-foreground">
                                                        O usuário tem um total de <span className="font-bold">{report?.totalAlertas ?? 0}</span> alertas ativos no período.
                                                    </p>
                                                </div>
                                            )
                                                : (
                                                    <div className="flex items-center justify-start gap-6 bg-secondary p-6 rounded-md mb-6 bg-success-light">
                                                        <CheckCircle2Icon className="min-h-6 min-w-6 size-6 text-success-foreground" />
                                                        <p className="text-body text-success-foreground">
                                                            O usuário não tem nenhum alerta ativo no período.
                                                        </p>
                                                    </div>
                                                )}
                                    </>
                                )
                            }


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-secondary p-6 rounded-xs flex items-start gap-4 justify-between">
                                    <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-muted flex items-center justify-center">
                                        {isLoadingReport ? (
                                            <Spinner className="size-6 animate-spin text-muted-foreground" />
                                        ) : (
                                            <p className="font-bold text-muted-foreground">{report?.nomeCliente.charAt(0)}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-6 w-full">
                                        <div className="flex flex-col items-start justify-center gap-2">
                                            {isLoadingReport ? (
                                                <Skeleton className="w-full h-6" />
                                            ) : (
                                                <p className="text-foreground text-body font-bold">{report?.nomeCliente}</p>
                                            )}
                                            {isLoadingReport ? (
                                                <Skeleton className="w-1/2 h-4" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground">Client ID: </p>
                                                    <p className="text-foreground text-caption">{report?.clienteId.slice(0, 4)}...{report?.clienteId.slice(-4)}</p>
                                                    <CopyButton textToCopy={report?.clienteId ?? ""} variant="secondary" size="small" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-start md:items-start w-full gap-y-4 gap-x-8 gap-x-12 lg:gap-y-8">
                                            <div className="flex flex-col items-start justify-center gap-2">
                                                <p className="text-caption text-muted-foreground">Data de criação</p>
                                                {isLoadingReport ? (
                                                    <Skeleton className="w-18 h-4" />
                                                ) : (
                                                    <p className="text-body text-foreground">{formatDate(report?.dataCriacao ?? "")}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start justify-center gap-2">
                                                <p className="text-caption text-muted-foreground">Nacionalidade</p>
                                                {isLoadingReport ? (
                                                    <Skeleton className="w-18 h-4" />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage
                                                            country={report?.pais ?? ""}
                                                            className="size-4"
                                                        />
                                                        <p className="text-body text-foreground">
                                                            {report?.pais}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start justify-center gap-2">
                                                <p className="text-caption text-muted-foreground">Nível de Risco</p>
                                                {isLoadingReport ? (
                                                    <Skeleton className="w-18 h-4" />
                                                ) : (
                                                    <Badge
                                                        style={getBadgeStyleByRisk(report?.nivelRisco ?? "")}
                                                    >
                                                        {report?.nivelRisco}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start justify-center gap-2">
                                                <p className="text-caption text-muted-foreground">KYC Status</p>
                                                {isLoadingReport ? (
                                                    <Skeleton className="w-18 h-4" />
                                                ) : (
                                                    <Badge
                                                        style={getBadgeStyleByKyc(report?.statusKyc ?? "")}
                                                    >
                                                        {report?.statusKyc}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-secondary p-6 rounded-xs">
                                    <div className="flex items-center justify-start gap-2 mb-4">
                                        {isLoadingReport ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            report?.dataUltimaTransacao ? (
                                                <p className="text-caption text-foreground">Última transação {formatDate(report?.dataUltimaTransacao)}</p>
                                            ) : (
                                                <p className="text-caption text-muted-foreground">Usuário nunca realizou uma transação.</p>
                                            ))}
                                    </div>
                                    <h3 className="text-h3 font-regular text-secondary-foreground">
                                        Total movimentado no período
                                    </h3>
                                    {isLoadingReport ? (
                                        <Skeleton className="w-18 h-12 mt-3" />
                                    ) : (
                                        <p className="text-display text-foreground font-semibold">
                                            {formatMoney(totalMovedSelectedCurrency, selectedCurrency)}
                                        </p>
                                    )}

                                    {totalsByCurrency.length > 1 && (
                                        <div className="mt-4">
                                            <p className="text-caption text-muted-foreground mb-2">
                                                Totais por moeda:
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                {totalsByCurrency.map((x) => (
                                                    <Badge
                                                        key={x.currency}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {x.currency}: {formatMoney(x.total, x.currency)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="w-full">
                                <SectionTitle>
                                    Transações
                                </SectionTitle>
                                <div className="flex items-center justify-start gap-2 mb-4">
                                    <InfoIcon className="size-4 text-muted-foreground text-body" />
                                    <p className="text-body font-regular text-muted-foreground">
                                        Movimentação por tipo ({selectedCurrency})
                                    </p>
                                </div>
                                <div className="h-[320px] w-full mt-4 min-w-0">
                                    <BarChart
                                        data={barData}
                                        gradientType="gray"
                                        formatter={(value) =>
                                            formatMoney(Number(value), selectedCurrency)
                                        }
                                        labelFormatter={(label) => `Tipo: ${label}`}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <SectionTitle>
                                    Alertas por severidade
                                </SectionTitle>
                                <div className="flex items-center justify-start gap-2 mb-4">
                                    <InfoIcon className="size-4 text-muted-foreground text-body" />
                                    <p className="text-body font-regular text-muted-foreground">
                                        Alertas por severidade
                                    </p>
                                </div>
                                <div className="h-[320px] w-full mt-4 min-w-0">
                                    <PieChart
                                        data={alertsBySeverity}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={110}
                                        label
                                        getCellColor={(entry) => getSeverityPieColor(entry.name as AlertSeverity)}
                                        formatter={(value) => String(value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <SectionTitle>
                                Alertas ativos no período
                            </SectionTitle>
                            {alertsError ? (
                                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md mb-4">
                                    <TriangleAlert className="size-5" />
                                    <p>{alertsError}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full hidden md:block">
                                        <DataTable
                                            columns={getAlertsColumns()}
                                            data={alerts.map(mapAPIAlertToMockAlert)}
                                            getRowKey={(alert) => alert.id}
                                            loading={isLoadingAlerts}
                                            emptyDescription="Nenhum alerta no período. Verifique os filtros aplicados ou entre em contato com o suporte."
                                            emptyMessage="Nenhum alerta encontrado."
                                        />
                                    </div>
                                    <div className="block md:hidden">
                                        <CardTable
                                            data={alerts.map(mapAPIAlertToMockAlert)}
                                            itemsPerPage={10}
                                            getRowKey={(alert) => alert.id}
                                            renderCard={(alert) => <ComplianceCard alert={alert} />}
                                            loading={isLoadingAlerts}
                                            emptyDescription="Nenhum alerta no período. Verifique os filtros aplicados ou entre em contato com o suporte."
                                            emptyMessage="Nenhum alerta encontrado."
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <SectionTitle>
                                Detalhes de Transações
                            </SectionTitle>

                            {transactionsError ? (
                                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md">
                                    <TriangleAlert className="size-5" />
                                    <p>{transactionsError}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full hidden md:block">
                                        <DataTable
                                            columns={getTransactionsColumns()}
                                            data={clientTransactions
                                                .slice()
                                                .sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1))}
                                            getRowKey={(transaction) => transaction.id}
                                            emptyDescription="Nenhuma transação no período. Verifique os filtros aplicados ou entre em contato com o suporte."
                                            emptyMessage="Nenhuma transação encontrada."
                                            loading={isLoadingTransactions}
                                        />
                                    </div>
                                    <div className="block md:hidden">
                                        <CardTable
                                            data={clientTransactions
                                                .slice()
                                                .sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1))}
                                            itemsPerPage={10}
                                            getRowKey={(transaction) => transaction.id}
                                            renderCard={(transaction) => <TransactionCard transaction={transaction} />}
                                            emptyDescription="Nenhuma transação no período. Verifique os filtros aplicados ou entre em contato com o suporte."
                                            emptyMessage="Nenhuma transação encontrada."
                                            loading={isLoadingTransactions}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                </div>
            </div>
        </div>
    );
}
