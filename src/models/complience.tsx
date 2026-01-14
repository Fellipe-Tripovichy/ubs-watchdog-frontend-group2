import type { Alert, Severidade, Status } from "@/types/compliance";
import type { ColumnDef } from "@/components/table/dataTable";
import { getColorByStatus, formatDateTime } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copyButton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export interface DisplayAlert {
    id: string;
    clientId: string;
    transactionId: string;
    rule: string;
    severity: Severidade;
    status: Status;
    dataCriacao: string;
    dataResolucao: string | null;
    resolvidoPor: string | null;
}

export function mapAPIAlertToMockAlert(apiAlert: Alert): DisplayAlert {
    return {
        id: apiAlert.id,
        clientId: apiAlert.clienteId,
        transactionId: apiAlert.transacaoId,
        rule: apiAlert.nomeRegra,
        severity: apiAlert.severidade,
        status: apiAlert.status,
        dataCriacao: apiAlert.dataCriacao,
        dataResolucao: apiAlert.dataResolucao,
        resolvidoPor: apiAlert.resolvidoPor,
    };
}

export function getBadgeStyleBySeverity(severity: Severidade) {
    const statusMap: Record<Severidade, string> = {
        Critica: "critical",
        Alta: "high",
        Media: "medium",
        Baixa: "low",
    };
    const colors = getColorByStatus(statusMap[severity]);
    return {
        backgroundColor: colors.light,
        color: colors.foreground,
    };
}

export function getBadgeStyleByStatus(status: Status) {
    const statusMap: Record<Status, string> = {
        Resolvido: "resolved",
        EmAnalise: "in-review",
        Novo: "new",
    };
    const colors = getColorByStatus(statusMap[status]);
    return {
        backgroundColor: colors.light,
        color: colors.foreground,
    };
}

export function getAlertsColumns(): ColumnDef<DisplayAlert>[] {
    return [
        {
            key: "id",
            label: "ID",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => {
                return (
                    <div className="flex items-center gap-2 justify-between">
                        <p>{alert.id.slice(0, 4)}...{alert.id.slice(-4)}</p>
                        <CopyButton textToCopy={alert.id} variant="secondary" size="small" />
                    </div>
                );
            },
        },
        {
            key: "transactionId",
            label: "ID da Transação",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => {
                return (
                    <div className="flex items-center gap-2 justify-between">
                        <p>{alert.transactionId.slice(0, 4)}...{alert.transactionId.slice(-4)}</p>
                        <CopyButton textToCopy={alert.transactionId} variant="secondary" size="small" />
                    </div>
                );
            },
        },
        {
            key: "rule",
            label: "Regra",
            className: "py-3 pr-4 min-w-[260px]",
            headerClassName: "py-3 pr-4",
            render: (alert) => alert.rule,
        },
        {
            key: "dataCriacao",
            label: "Data de Criação",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => formatDateTime(alert.dataCriacao),
        },
        {
            key: "severity",
            label: "Severidade",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => {
                const severityLabels: Record<Severidade, string> = {
                    Baixa: 'Baixa',
                    Media: 'Média',
                    Alta: 'Alta',
                    Critica: 'Crítica',
                };
                return (
                    <Badge style={getBadgeStyleBySeverity(alert.severity)}>
                        {severityLabels[alert.severity]}
                    </Badge>
                );
            },
        },
        {
            key: "status",
            label: "Status",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => {
                const statusLabels: Record<Status, string> = {
                    Novo: 'Novo',
                    EmAnalise: 'Em Análise',
                    Resolvido: 'Resolvido',
                };
                return (
                    <div className="flex items-center gap-2">
                        <Badge style={getBadgeStyleByStatus(alert.status)}>
                            {statusLabels[alert.status]}
                        </Badge>
                        {alert.status === "Resolvido" && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon className="size-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="p-4">
                                    <p className="text-caption text-muted-foreground">
                                        Data de Resolução: <span className="font-bold">{alert.dataResolucao ? formatDateTime(alert.dataResolucao) : "-"}</span>
                                    </p>
                                    <p className="text-caption text-muted-foreground">
                                        Resolvido por: <span className="font-bold">{alert.resolvidoPor || "-"}</span>
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            key: "details",
            label: "Detalhes",
            className: "py-3 pr-4 whitespace-nowrap",
            headerClassName: "py-3 pr-4",
            render: (alert) => {
                return (
                    <div className="flex items-center justify-end cursor-pointer px-2">
                        <Link href={`/compliance/${alert.id}`}>
                            <ArrowUpRight className="size-5 text-primary" />
                        </Link>
                    </div>
                );
            },
        },
    ];
}
