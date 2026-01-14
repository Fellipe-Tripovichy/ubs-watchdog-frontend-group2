"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
    fetchTransactionById,
    selectCurrentTransaction,
    selectCurrentTransactionLoading,
} from "@/features/transactions/transactionsSlice";
import {
    fetchClientById,
    selectCurrentClient,
    selectCurrentClientLoading,
    selectContraparteClient,
    selectContraparteClientLoading,
} from "@/features/client/clientSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatDateTime, getColorByStatus, formatDate } from "@/lib/utils";
import { TriangleAlert, CheckCircle2Icon, UserRoundXIcon } from "lucide-react";

import { SectionTitle } from "@/components/ui/sectionTitle";
import { HeroTitle } from "@/components/ui/heroTitle";
import { CopyButton } from "@/components/ui/copyButton";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagImage } from "@/components/ui/flagImage";
import { getBadgeStyleByKyc, getBadgeStyleByRisk } from "@/models/reports";
import { CURRENCIES } from "@/models/transactions";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyMedia,
} from "@/components/ui/empty";

function getTypeLabel(type: string): string {
    const map: Record<string, string> = {
        Transferencia: "Transferência",
        Deposito: "Depósito",
        Saque: "Saque",
    };
    return map[type] || type;
}

function AlertBadge({
    quantidadeAlertas,
    className
}: {
    quantidadeAlertas: number;
    className?: string;
}) {
    if (quantidadeAlertas > 0) {
        return (
            <div className={className}>
                <Badge
                    style={{
                        backgroundColor: getColorByStatus("warning").light,
                        color: getColorByStatus("warning").foreground,
                    }}>
                    <div className="flex items-center justify-start gap-2">
                        <TriangleAlert className="min-h-4 min-w-4 size-4 text-warning-foreground" />
                        {quantidadeAlertas} alerta(s) associados
                    </div>
                </Badge>
            </div>
        );
    }

    return (
        <div className={className}>
            <Badge
                style={{
                    backgroundColor: getColorByStatus("success").light,
                    color: getColorByStatus("success").foreground,
                }}>
                <div className="flex items-center justify-start gap-2">
                    <CheckCircle2Icon className="min-h-4 min-w-4 size-4 text-success-foreground" />
                    Sem alertas associados
                </div>
            </Badge>
        </div>
    );
}

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const transaction = useAppSelector(selectCurrentTransaction);
    const isLoading = useAppSelector(selectCurrentTransactionLoading);
    const client = useAppSelector(selectCurrentClient);
    const isLoadingClient = useAppSelector(selectCurrentClientLoading);
    const isLoadingContraparte = useAppSelector(selectContraparteClientLoading);
    const contraparteClient = useAppSelector(selectContraparteClient);

    const transactionId = React.useMemo(() => {
        const id = params?.id as string;
        return id || "";
    }, [params?.id]);

    React.useEffect(() => {
        if (!transactionId || !token) return;

        dispatch(fetchTransactionById({
            transacaoId: transactionId,
            token,
        }));
    }, [transactionId, token, dispatch]);


    React.useEffect(() => {
        if (!transaction?.clienteId || !token) return;
        dispatch(fetchClientById({
            clientId: transaction.clienteId,
            token,
        }));
    }, [transaction?.clienteId, token, dispatch]);

    React.useEffect(() => {
        if (!transaction?.contraparteId || !token) return;
        dispatch(fetchClientById({
            clientId: transaction.contraparteId,
            token,
            contraparte: true,
        }));
    }, [transaction?.contraparteId, token, dispatch]);

    return (
        <div className="flex flex-col items-start w-full">
            <div className="w-full">
                <div className="w-full flex items-center justify-start">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-[1554px] mx-auto p-6">
                        <div className="bg-background/95 z-5 flex flex-col items-start justify-start w-full">
                            <LinkButton icon="chevron-left" iconLeft={true} asChild className="mb-4" onClick={() => router.back()}>
                                Voltar
                            </LinkButton>
                            <HeroTitle loading={isLoading} as="h1" subtitle={formatDateTime(transaction?.dataHora ?? "")}>
                                Detalhes da {getTypeLabel(transaction?.tipo ?? "Transação")}
                            </HeroTitle>
                        </div>
                        {isLoading ? (
                            <Skeleton className="w-18 h-6" />
                        ) : transaction ? (
                            <AlertBadge
                                quantidadeAlertas={transaction.quantidadeAlertas}
                                className="mt-6 md:mt-0"
                            />
                        ) : null}
                    </div>
                </div>
                <div className="max-w-[1554px] mx-auto px-4 md:px-8 py-8">
                    <div className="flex flex-col gap-20">
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-secondary p-6 rounded-xs">
                                    <h3 className="text-h3 font-regular text-secondary-foreground">
                                        Valor da transação
                                    </h3>
                                    {isLoading ? (
                                        <Skeleton className="w-18 h-12 mt-3" />
                                    ) : transaction ? (
                                        <p className="text-display text-foreground font-semibold">
                                            {formatMoney(transaction.valor, transaction.moeda)}
                                        </p>
                                    ) : null}
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-caption text-muted-foreground align-base">
                                            Moeda:
                                        </p>
                                        {isLoading ? (
                                            <Skeleton className="w-18 h-4" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FlagImage
                                                    country={CURRENCIES.find(currency => currency.code === transaction?.moeda)?.countryCode ?? ""}
                                                    className="size-4"
                                                />
                                                <p className="text-body text-foreground">
                                                    {CURRENCIES.find(currency => currency.code === transaction?.moeda)?.fullName ?? ""}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <SectionTitle>
                                    Informações do cliente
                                </SectionTitle>
                                <div className="grid grid-cols-1 ">
                                    <div className="bg-secondary p-6 rounded-xs flex items-start gap-4 justify-between">
                                        <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-muted flex items-center justify-center">
                                            {isLoadingClient ? (
                                                <Spinner className="size-6 animate-spin text-muted-foreground" />
                                            ) : (
                                                <p className="font-bold text-muted-foreground">{client?.nome.charAt(0)}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-6 w-full">
                                            <div className="flex flex-wrap items-start md:items-start w-full gap-y-4 gap-x-8 gap-x-12 lg:gap-y-8">
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-full h-6" />
                                                    ) : (
                                                        <p className="text-foreground text-body font-bold">{client?.nome}</p>
                                                    )}
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-1/2 h-4" />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-muted-foreground">Client ID: </p>
                                                            <p className="text-foreground text-caption">{client?.id.slice(0, 4)}...{client?.id.slice(-4)}</p>
                                                            <CopyButton textToCopy={client?.id ?? ""} variant="secondary" size="small" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">Data de criação</p>
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-18 h-4" />
                                                    ) : (
                                                        <p className="text-body text-foreground">{formatDate(client?.dataCriacao ?? "")}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">Nacionalidade</p>
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-18 h-4" />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <FlagImage
                                                                country={client?.pais ?? ""}
                                                                className="size-4"
                                                            />
                                                            <p className="text-body text-foreground">
                                                                {client?.pais}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">Nível de Risco</p>
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-18 h-4" />
                                                    ) : (
                                                        <Badge
                                                            style={getBadgeStyleByRisk(client?.nivelRisco as "Baixo" | "Médio" | "Alto" | "Nenhum")}
                                                        >
                                                            {client?.nivelRisco}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <p className="text-caption text-muted-foreground">KYC Status</p>
                                                    {isLoadingClient ? (
                                                        <Skeleton className="w-18 h-4" />
                                                    ) : (
                                                        <Badge
                                                            style={getBadgeStyleByKyc(client?.statusKyc as "Aprovado" | "Pendente" | "Rejeitado" | "Nenhum")}
                                                        >
                                                            {client?.statusKyc}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {transaction?.tipo === "Transferencia" && (
                                <div>
                                    <SectionTitle>
                                        Cliente destino
                                    </SectionTitle>
                                    {contraparteClient || isLoadingContraparte || isLoadingClient ? (
                                        <div className="grid grid-cols-1 ">
                                            <div className="bg-secondary p-6 rounded-xs flex items-start gap-4 justify-between">
                                                <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-muted flex items-center justify-center">
                                                    {isLoadingContraparte || isLoadingClient ? (
                                                        <Spinner className="size-6 animate-spin text-muted-foreground" />
                                                    ) : (
                                                        <p className="font-bold text-muted-foreground">{contraparteClient?.nome.charAt(0)}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-6 w-full">
                                                    <div className="flex flex-wrap items-start md:items-start w-full gap-y-4 gap-x-8 gap-x-12 lg:gap-y-8">
                                                        <div className="flex flex-col items-start justify-center gap-2">
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-full h-6" />
                                                            ) : (
                                                                <p className="text-foreground text-body font-bold">{contraparteClient?.nome}</p>
                                                            )}
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-1/2 h-4" />
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-xs text-muted-foreground">Client destino ID: </p>
                                                                    <p className="text-foreground text-caption">{contraparteClient?.id.slice(0, 4)}...{client?.id.slice(-4)}</p>
                                                                    <CopyButton textToCopy={contraparteClient?.id ?? ""} variant="secondary" size="small" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start justify-center gap-2">
                                                            <p className="text-caption text-muted-foreground">Data de criação</p>
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-18 h-4" />
                                                            ) : (
                                                                <p className="text-body text-foreground">{formatDate(contraparteClient?.dataCriacao ?? "")}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start justify-center gap-2">
                                                            <p className="text-caption text-muted-foreground">Nacionalidade</p>
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-18 h-4" />
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <FlagImage
                                                                        country={contraparteClient?.pais ?? ""}
                                                                        className="size-4"
                                                                    />
                                                                    <p className="text-body text-foreground">
                                                                        {contraparteClient?.pais}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start justify-center gap-2">
                                                            <p className="text-caption text-muted-foreground">Nível de Risco</p>
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-18 h-4" />
                                                            ) : (
                                                                <Badge
                                                                    style={getBadgeStyleByRisk(contraparteClient?.nivelRisco as "Baixo" | "Médio" | "Alto" | "Nenhum")}
                                                                >
                                                                    {contraparteClient?.nivelRisco}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start justify-center gap-2">
                                                            <p className="text-caption text-muted-foreground">KYC Status</p>
                                                            {isLoadingContraparte || isLoadingClient ? (
                                                                <Skeleton className="w-18 h-4" />
                                                            ) : (
                                                                <Badge
                                                                    style={getBadgeStyleByKyc(contraparteClient?.statusKyc as "Aprovado" | "Pendente" | "Rejeitado" | "Nenhum")}
                                                                >
                                                                    {contraparteClient?.statusKyc}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>) : (
                                        <Empty className="w-full h-full">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <UserRoundXIcon />
                                                </EmptyMedia>
                                                <EmptyTitle>Nenhum cliente destino encontrado</EmptyTitle>
                                                <EmptyDescription>
                                                    Não há cliente destino para esta transação. Refaça sua busca ou entre em contato com o suporte.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
