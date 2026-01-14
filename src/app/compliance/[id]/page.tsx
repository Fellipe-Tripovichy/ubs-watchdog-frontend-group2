"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken, selectUser } from "@/features/auth/authSlice";
import {
    fetchAlertById,
    startAnalysis,
    resolveAlert,
    selectCurrentAlert,
    selectCurrentAlertLoading,
    selectComplianceError,
    selectComplianceUpdating,
} from "@/features/compliance/complianceSlice";
import {
    fetchClientById,
    selectCurrentClient,
    selectCurrentClientLoading,
} from "@/features/client/clientSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatDate, getColorByStatus, formatMoney } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import { SectionTitle } from "@/components/ui/sectionTitle";
import { HeroTitle } from "@/components/ui/heroTitle";
import { CopyButton } from "@/components/ui/copyButton";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagImage } from "@/components/ui/flagImage";
import { getBadgeStyleBySeverity, getBadgeStyleByStatus } from "@/models/complience";
import { getBadgeStyleByKyc, getBadgeStyleByRisk } from "@/models/reports";
import type { Severidade, Status } from "@/types/compliance";
import { fetchTransactionById, selectCurrentTransaction, selectCurrentTransactionLoading } from "@/features/transactions/transactionsSlice";
import { CURRENCIES } from "@/models/transactions";
import { Button } from "@/components/ui/button";
import { ConfirmAnalysisDialog } from "@/components/compliance/confirmAnalysisDialog";
import { ConfirmResolutionDialog } from "@/components/compliance/confirmResolutionDialog";

function getSeverityLabel(severity: Severidade): string {
    const severityLabels: Record<Severidade, string> = {
        Baixa: 'Baixa',
        Media: 'Média',
        Alta: 'Alta',
        Critica: 'Crítica',
    };
    return severityLabels[severity];
}

function getStatusLabel(status: Status): string {
    const statusLabels: Record<Status, string> = {
        Novo: 'Novo',
        EmAnalise: 'Em Análise',
        Resolvido: 'Resolvido',
    };
    return statusLabels[status];
}

function getTypeLabel(type: string): string {
    const map: Record<string, string> = {
        Transferencia: "Transferência",
        Deposito: "Depósito",
        Saque: "Saque",
    };
    return map[type] || type;
}

export default function ComplianceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const alert = useAppSelector(selectCurrentAlert);
    const isLoading = useAppSelector(selectCurrentAlertLoading);
    const error = useAppSelector(selectComplianceError);
    const isUpdating = useAppSelector(selectComplianceUpdating);
    const client = useAppSelector(selectCurrentClient);
    const isLoadingClient = useAppSelector(selectCurrentClientLoading);
    const transaction = useAppSelector(selectCurrentTransaction);
    const isLoadingTransaction = useAppSelector(selectCurrentTransactionLoading);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isResolutionDialogOpen, setIsResolutionDialogOpen] = React.useState(false);

    const alertId = React.useMemo(() => {
        const id = params?.id as string;
        return id || "";
    }, [params?.id]);

    React.useEffect(() => {
        if (!alertId || !token) return;

        dispatch(fetchAlertById({
            alertId,
            token,
        }));
    }, [alertId, token, dispatch]);

    React.useEffect(() => {
        if (!alert?.clienteId || !token) return;
        dispatch(fetchClientById({
            clientId: alert.clienteId,
            token,
        }));
    }, [alert?.clienteId, token, dispatch]);

    React.useEffect(() => {
        if (!alert?.transacaoId || !token) return;
        dispatch(fetchTransactionById({
            transacaoId: alert.transacaoId,
            token,
        }));
    }, [alert?.transacaoId, token, dispatch]);

    const handleStartAnalysis = async () => {
        if (!alertId || !token) return;

        const result = await dispatch(startAnalysis({
            alertId,
            token,
        }));

        if (startAnalysis.fulfilled.match(result)) {
            setIsDialogOpen(false);

            dispatch(fetchAlertById({
                alertId,
                token,
            }));
        }
    };

    const handleResolveAlert = async (resolucao: string) => {
        if (!alertId || !token || !user?.displayName) return;

        const result = await dispatch(resolveAlert({
            alertId,
            resolvidoPor: user.displayName,
            resolucao,
            token,
        }));

        if (resolveAlert.fulfilled.match(result)) {
            setIsResolutionDialogOpen(false);

            dispatch(fetchAlertById({
                alertId,
                token,
            }));
        }
    };

    return (
        <div className="flex flex-col items-start w-full">
            <div className="w-full">
                <div className="w-full flex items-center justify-start">
                    <div className="flex flex-col md:flex-row p-6 items-start md:items-center justify-between w-full max-w-[1554px] mx-auto">
                        <div className="bg-background/95 z-5 flex flex-col items-start justify-start w-full">
                            <LinkButton icon="chevron-left" iconLeft={true} asChild className="mb-4" onClick={() => router.back()}>
                                Voltar
                            </LinkButton>
                            <HeroTitle loading={isLoading} as="h1" subtitle={alert ? formatDateTime(alert.dataCriacao) : ""}>
                                {alert ? alert.nomeRegra : "Detalhes do Alerta"}
                            </HeroTitle>
                        </div>
                        <div className="flex flex-col items-start md:items-end mt-6 md:mt-0 md:gap-6 gap-4">
                            <div className="flex items-center md:gap-6 gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-caption text-muted-foreground">Severidade</p>
                                    {isLoading ? (
                                        <Skeleton className="w-18 h-6" />
                                    ) : alert ? (
                                        <Badge style={getBadgeStyleBySeverity(alert.severidade)}>
                                            {getSeverityLabel(alert.severidade)}
                                        </Badge>
                                    ) : null}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-caption text-muted-foreground">Status</p>
                                    {isLoading ? (
                                        <Skeleton className="w-18 h-6" />
                                    ) : alert ? (
                                        <Badge style={getBadgeStyleByStatus(alert.status)}>
                                            {getStatusLabel(alert.status)}
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex items-center justify-start md:justify-end gap-2">
                                {alert?.status === "Novo" &&
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        onClick={() => setIsDialogOpen(true)}
                                        disabled={isUpdating}
                                    >
                                        <p>Iniciar Análise</p>
                                    </Button>}
                                {alert?.status === "EmAnalise" &&
                                    <Button
                                        size="small"
                                        variant="default"
                                        onClick={() => setIsResolutionDialogOpen(true)}
                                        disabled={isUpdating}
                                    >
                                        <p>Resolver Alerta</p>
                                    </Button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1554px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-20 w-full">
                    <div className="bg-secondary p-6 rounded-xs">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                            <div className="flex flex-col gap-2">
                                <p className="text-caption text-muted-foreground">ID do Alerta</p>
                                {isLoading ? (
                                    <Skeleton className="w-18 h-4" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-body text-foreground">{alert?.id?.slice(0, 4)}...{alert?.id?.slice(-4)}</p>
                                        <CopyButton textToCopy={alert?.id ?? ""} variant="secondary" size="small" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-caption text-muted-foreground">Descrição</p>
                                {isLoading ? (
                                    <Skeleton className="w-18 h-4" />
                                ) : (
                                    <p className="text-body text-foreground">{alert?.descricao ?? ""}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {alert?.dataResolucao && (
                        <div className="flex flex-col">
                            <SectionTitle>Detalhes da Resolução</SectionTitle>
                            <div className="bg-secondary p-6 rounded-xs">
                                <div className="flex flex-wrap items-start md:items-start w-full gap-y-4 gap-x-12 sm:gap-x-12 sm:gap-y-8 mb-6 md:gap-x-12">
                                    <div className="flex flex-col gap-2 w-auto">
                                        <p className="text-caption text-muted-foreground">Data de Resolução</p>
                                        {isLoading ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <p className="text-body text-foreground">{formatDateTime(alert?.dataResolucao ?? "")}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-auto">
                                        <p className="text-caption text-muted-foreground">Resolvido por</p>
                                        {isLoading ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <p className="text-body text-foreground">{alert?.resolvidoPor ?? ""}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-auto">
                                        <p className="text-caption text-muted-foreground">Resolução</p>
                                        {isLoading ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <p className="text-body text-foreground">{alert?.resolucao ?? "Resolução não informada"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <SectionTitle>Transação Relacionada</SectionTitle>
                            <LinkButton icon="arrow-up-right" iconLeft={false} asChild disabled={isLoadingTransaction}>
                                <Link href={`/transactions/${transaction?.id ?? ""}`}>Ver transação</Link>
                            </LinkButton>
                        </div>
                        <div className="bg-secondary p-6 rounded-xs w-full">
                            <div className="flex flex-wrap items-start w-full gap-y-4 gap-x-12 sm:gap-x-0 lg:gap-y-8 mb-6">
                                <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                    <p className="text-caption text-muted-foreground">ID da Transação</p>
                                    {isLoadingTransaction ? (
                                        <Skeleton className="w-18 h-4" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-body text-foreground">{transaction?.id.slice(0, 4)}...{transaction?.id.slice(-4)}</p>
                                            <CopyButton textToCopy={transaction?.id ?? ""} variant="secondary" size="small" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                    <p className="text-caption text-muted-foreground">Tipo</p>
                                    {isLoadingTransaction ? (
                                        <Skeleton className="w-18 h-4" />
                                    ) : (
                                        <p className="text-body text-foreground">{getTypeLabel(transaction?.tipo ?? "")}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                    <p className="text-caption text-muted-foreground">Valor</p>
                                    {isLoadingTransaction ? (
                                        <Skeleton className="w-18 h-4" />
                                    ) : (
                                        <p className="text-body text-foreground">{formatMoney(transaction?.valor ?? 0, transaction?.moeda ?? "")}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                    <p className="text-caption text-muted-foreground">Moeda</p>
                                    {isLoadingTransaction ? (
                                        <Skeleton className="w-18 h-4" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FlagImage
                                                country={CURRENCIES.find(currency => currency.code === transaction?.moeda)?.countryCode ?? ""}
                                                className="size-4"
                                            />
                                            <p className="text-body text-foreground">
                                                {CURRENCIES.find(currency => currency.code === transaction?.moeda)?.fullName ?? transaction?.moeda ?? ""}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                    <p className="text-caption text-muted-foreground">Data e Hora</p>
                                    {isLoadingTransaction ? (
                                        <Skeleton className="w-18 h-4" />
                                    ) : (
                                        <p className="text-body text-foreground">{formatDateTime(transaction?.dataHora ?? "")}</p>
                                    )}
                                </div>
                                {transaction?.contraparteId && (
                                    <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-1/3">
                                        <p className="text-caption text-muted-foreground">Contraparte</p>
                                        {isLoadingTransaction ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <p className="text-body text-foreground">{transaction?.contraparteId ?? ""}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <SectionTitle>Cliente Relacionado</SectionTitle>
                            <LinkButton icon="arrow-up-right" iconLeft={false} asChild disabled={isLoadingClient}>
                                <Link href={`/reports/${client?.id ?? ""}`}>Ver relatório do cliente</Link>
                            </LinkButton>
                        </div>
                        <div className="bg-secondary p-6 rounded-xs">
                            <div className="flex flex-col w-full">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-muted flex items-center justify-center">
                                        <p className="font-bold text-muted-foreground">{client?.nome.charAt(0)}</p>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        {isLoadingClient ? (
                                            <Skeleton className="w-full h-4" />
                                        ) : (
                                            <p className="text-foreground text-body font-bold">{client?.nome}</p>
                                        )}
                                        {isLoadingClient ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">Client ID: </p>
                                                <p className="text-foreground text-caption">{client?.id.slice(0, 4)}...{client?.id.slice(-4)}</p>
                                                <CopyButton textToCopy={client?.id ?? ""} variant="secondary" size="small" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-start w-full gap-y-4 gap-x-12 sm:gap-x-0 lg:gap-y-8 mb-6 pl-14">
                                    <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                        <p className="text-caption text-muted-foreground">Data de criação</p>
                                        {isLoadingClient ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <p className="text-body text-foreground">{formatDate(client?.dataCriacao ?? "")}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                        <p className="text-caption text-muted-foreground">Nacionalidade</p>
                                        {isLoadingClient ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FlagImage
                                                    country={client?.pais ?? ""}
                                                    className="size-4"
                                                />
                                                <p className="text-body text-foreground">{client?.pais ?? ""}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                        <p className="text-caption text-muted-foreground">Nível de Risco</p>
                                        {isLoadingClient ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <Badge style={getBadgeStyleByRisk(client?.nivelRisco as "Baixo" | "Médio" | "Alto" | "Nenhum")}>
                                                {client?.nivelRisco ?? ""}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-auto sm:w-1/2 md:w-1/3">
                                        <p className="text-caption text-muted-foreground">KYC Status</p>
                                        {isLoadingClient ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <Badge style={getBadgeStyleByKyc(client?.statusKyc as "Aprovado" | "Pendente" | "Rejeitado" | "Nenhum")}>
                                                {client?.statusKyc ?? ""}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmAnalysisDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleStartAnalysis}
                isUpdating={isUpdating}
            />

            <ConfirmResolutionDialog
                open={isResolutionDialogOpen}
                onOpenChange={setIsResolutionDialogOpen}
                onConfirm={handleResolveAlert}
                isUpdating={isUpdating}
            />
        </div>
    );
}
