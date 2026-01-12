"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import { fetchClientReport, selectCurrentReport, selectReportsLoading } from "@/features/reports/reportsSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColorByStatus, formatMoney, isoToDate, dateToISO, startOfCurrentMonthISO, todayISO, formatDate, formatDateTime } from "@/lib/utils";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { FilterIcon, InfoIcon, TriangleAlert } from "lucide-react"
import Link from "next/link";

import {
    type TransactionType,
    type AlertSeverity,
} from "@/mocks/reportsMock";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { FlagImage } from "@/components/ui/flagImage";
import { HeroTitle } from "@/components/ui/heroTitle";
import { IconButton } from "@/components/ui/iconButton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getTransactionSummaryColumns, getAlertsColumns, getTransactionsColumns } from "@/models/reports";
import { ResumeTransactionCard } from "@/components/transactions/resumeTransactionCard";
import { TransactionCard } from "@/components/transactions/transactionCard";
import { ComplianceCard } from "@/components/compliance/complianceCard";

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

function getBadgeStyleByRisk(risk: "Baixo" | "Médio" | "Alto") {
    const statusMap: Record<"Baixo" | "Médio" | "Alto", string> = {
        Baixo: "low",
        Médio: "medium",
        Alto: "high",
    };
    return createBadgeStyle(statusMap, risk);
}

function getBadgeStyleByKyc(kyc: "Aprovado" | "Pendente" | "Reprovado") {
    const statusMap: Record<"Aprovado" | "Pendente" | "Reprovado", string> = {
        Aprovado: "approved",
        Pendente: "pending",
        Reprovado: "rejected",
    };
    return createBadgeStyle(statusMap, kyc);
}

function getBadgeStyleBySeverity(sev: AlertSeverity) {
    const statusMap: Record<AlertSeverity, string> = {
        Crítica: "critical",
        Alta: "high",
        Média: "medium",
        Baixa: "low",
    };
    return createBadgeStyle(statusMap, sev);
}

function getBadgeStyleByStatus(status: "Novo" | "Em Análise" | "Resolvido") {
    const statusMap: Record<"Novo" | "Em Análise" | "Resolvido", string> = {
        Resolvido: "resolved",
        "Em Análise": "in-review",
        Novo: "new",
    };
    return createBadgeStyle(statusMap, status);
}

function PlainField({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex flex-col w-full">
            <span className="text-sm text-muted-foreground">{label}</span>
            <p className="text-sm text-foreground mt-1">{value}</p>
        </div>
    );
}

export default function ReportsPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const report = useAppSelector(selectCurrentReport);
    const isLoading = useAppSelector(selectReportsLoading);

    // Get client ID from URL params (e.g., "c-1023" from /reports/c-1023)
    const clientId = React.useMemo(() => {
        const id = params?.id as string;
        // Normalize to uppercase format if needed (C-1023)
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

    // Fetch report when clientId, dates, or token changes
    React.useEffect(() => {
        if (!clientId || !token || !isValidRange) return;

        dispatch(fetchClientReport({
            clientId,
            token,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        }));
    }, [clientId, token, startDate, endDate, dispatch, isValidRange]);

    const currencies = React.useMemo(() => {
        if (!report) return [];
        const set = new Set(report.transactions.map((t) => t.currency));
        return Array.from(set) as ("BRL" | "USD" | "EUR")[];
    }, [report]);

    const [selectedCurrency, setSelectedCurrency] = React.useState<"BRL" | "USD" | "EUR">("BRL");

    React.useEffect(() => {
        const next = currencies[0] ?? "BRL";
        if (!currencies.includes(selectedCurrency)) setSelectedCurrency(next);
    }, [currencies, selectedCurrency]);

    const txInCurrency = React.useMemo(() => {
        if (!report) return [];
        return report.transactions.filter((t) => t.currency === selectedCurrency);
    }, [report, selectedCurrency]);

    const totalMovedSelectedCurrency = React.useMemo(() => {
        return txInCurrency.reduce((acc, t) => acc + t.amount, 0);
    }, [txInCurrency]);

    const totalsByCurrency = React.useMemo(() => {
        if (!report) return [];
        const map = new Map<string, number>();
        for (const t of report.transactions) {
            map.set(t.currency, (map.get(t.currency) ?? 0) + t.amount);
        }
        return Array.from(map.entries()).map(([currency, total]) => ({
            currency,
            total,
        }));
    }, [report]);

    const totalsByType = React.useMemo(() => {
        const types: TransactionType[] = ["Depósito", "Saque", "Transferência"];
        const map: Record<TransactionType, { count: number; total: number }> = {
            Depósito: { count: 0, total: 0 },
            Saque: { count: 0, total: 0 },
            Transferência: { count: 0, total: 0 },
        };

        for (const tx of txInCurrency) {
            map[tx.type].count += 1;
            map[tx.type].total += tx.amount;
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
        if (!report) return [];
        const order: AlertSeverity[] = ["Crítica", "Alta", "Média", "Baixa"];
        const map: Record<AlertSeverity, number> = {
            Crítica: 0,
            Alta: 0,
            Média: 0,
            Baixa: 0,
        };
        for (const a of report.alerts) map[a.severity] += 1;
        return order
            .map((sev) => ({ name: sev, value: map[sev] }))
            .filter((x) => x.value > 0);
    }, [report]);

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
                {!isLoading && report && (
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
                )}
                <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8">
                    {isLoading && (
                        <div className="bg-secondary p-4 rounded-md flex items-center gap-2">
                            <Spinner />
                            <p className="text-sm text-muted-foreground">
                                Atualizando relatório...
                            </p>
                        </div>
                    )}

                    {!isLoading && !report && (
                        <div className="bg-secondary p-4 rounded-md">
                            <p className="text-sm text-muted-foreground">
                                Nenhum relatório encontrado para o cliente {clientId}.
                            </p>
                        </div>
                    )}

                    {report && !isLoading && (
                        <>
                            <div className="w-full">
                                <SectionTitle>
                                    Informações gerais
                                </SectionTitle>
                                {
                                    report.alerts.length > 0 && (
                                        <div className="flex items-center justify-start gap-6 bg-secondary p-6 rounded-md mb-6 bg-warning-light">
                                            <TriangleAlert className="min-h-6 min-w-6 size-6 text-warning-foreground" />
                                            <p className="text-body text-warning-foreground">
                                                O usuário tem um total de <span className="font-bold">{report.alerts.length}</span> alertas ativos no período.
                                            </p>
                                        </div>
                                    )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-secondary p-6 rounded-xs flex items-start gap-4 justify-between">
                                        <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-muted flex items-center justify-center">
                                            <p className="font-bold text-muted-foreground">{report.client.name?.charAt(0)}</p>
                                        </div>
                                        <div className="flex flex-col gap-6 w-full">
                                            <div className="flex flex-wrap items-start md:items-start w-full gap-6 lg:gap-12">
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-foreground text-body font-bold">{report.client.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-muted-foreground">Client ID: </p>
                                                        <p className="text-foreground text-caption">{report.client.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">Nacionalidade</p>
                                                    <div className="flex items-center gap-2">
                                                        <FlagImage
                                                            country={report.client.country}
                                                            className="size-4"
                                                        />
                                                        <p className="text-body text-foreground">
                                                            {report.client.country}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-start md:items-start w-full gap-6 md:gap-8 lg:gap-12">
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">Nível de Risco</p>
                                                    <Badge
                                                        style={getBadgeStyleByRisk(report.client.riskLevel)}
                                                    >
                                                        {report.client.riskLevel}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">KYC Status</p>
                                                    <Badge
                                                        style={getBadgeStyleByKyc(report.client.kycStatus)}
                                                    >
                                                        {report.client.kycStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-secondary p-6 rounded-xs">
                                        <h3 className="text-h3 font-regular text-secondary-foreground">
                                            Total movimentado no período
                                        </h3>
                                        <p className="text-display text-foreground font-semibold mt-1">
                                            {formatMoney(totalMovedSelectedCurrency, selectedCurrency)}
                                        </p>

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
                                <div className="w-full py-10">
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
                                <div className="w-full py-10">
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

                            <div className="py-10">
                                <SectionTitle>Resumo de transações ({selectedCurrency})</SectionTitle>
                                <>
                                    <div className="w-full hidden md:block">
                                        <DataTable
                                            columns={getTransactionSummaryColumns(selectedCurrency)}
                                            data={totalsByType}
                                            getRowKey={(row) => row.type}
                                        />
                                    </div>
                                    <div className="block md:hidden">
                                        <CardTable
                                            data={totalsByType}
                                            itemsPerPage={10}
                                            getRowKey={(row) => row.type}
                                            renderCard={(row) => <ResumeTransactionCard transaction={row} currency={selectedCurrency} />}
                                        />
                                    </div>
                                </>
                            </div>

                            <div className="py-10">
                                <SectionTitle>
                                    Alertas ativos no período
                                </SectionTitle>

                                {report.alerts.length === 0 ? (
                                    <div className="py-6 text-muted-foreground">
                                        Nenhum alerta no período.
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full hidden md:block">
                                            <DataTable
                                                columns={getAlertsColumns()}
                                                data={report.alerts}
                                                getRowKey={(alert) => alert.id}
                                            />
                                        </div>
                                        <div className="block md:hidden">
                                            <CardTable
                                                data={report.alerts}
                                                itemsPerPage={10}
                                                getRowKey={(alert) => alert.id}
                                                renderCard={(alert) => <ComplianceCard alert={alert} />}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="py-10">
                                <SectionTitle>
                                    Detalhes de Transações
                                </SectionTitle>

                                {report.transactions.length === 0 ? (
                                    <div className="py-6 text-muted-foreground">
                                        Nenhuma transação no período.
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full hidden md:block">
                                            <DataTable
                                                columns={getTransactionsColumns()}
                                                data={report.transactions
                                                    .slice()
                                                    .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1))}
                                                getRowKey={(transaction) => transaction.id}
                                            />
                                        </div>
                                        <div className="block md:hidden">
                                            <CardTable
                                                data={report.transactions
                                                    .slice()
                                                    .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1))}
                                                itemsPerPage={10}
                                                getRowKey={(transaction) => transaction.id}
                                                renderCard={(transaction) => <TransactionCard transaction={transaction} />}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
