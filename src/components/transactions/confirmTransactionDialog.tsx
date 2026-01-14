"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CopyButton } from "@/components/ui/copyButton";
import { CURRENCIES } from "@/models/transactions";
import type { Client } from "@/features/client/clientAPI";

interface ConfirmTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isCreating?: boolean;
    type: "Deposito" | "Saque" | "Transferencia";
    client?: Client | null;
    originClient?: Client | null;
    destinationClient?: Client | null;
    valor: string;
    moeda: string;
}

function formatMoneyValue(value: number | string): string {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : value;
    if (isNaN(numValue)) return "";
    const formatted = numValue.toFixed(2).replace(".", ",");
    const parts = formatted.split(",");
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+$)/g, "$1.");
    return parts.join(",");
}

const TRANSACTION_CONFIG = {
    Deposito: {
        title: "Confirmar Depósito",
        description: "Revise as informações do depósito antes de confirmar. Esta ação não pode ser desfeita.",
        valueLabel: "Valor do depósito",
        confirmButton: "Confirmar Depósito",
        processingButton: "Realizando depósito...",
    },
    Saque: {
        title: "Confirmar Saque",
        description: "Revise as informações do saque antes de confirmar. Esta ação não pode ser desfeita.",
        valueLabel: "Valor do saque",
        confirmButton: "Confirmar Saque",
        processingButton: "Realizando saque...",
    },
    Transferencia: {
        title: "Confirmar Transferência",
        description: "Revise as informações da transferência antes de confirmar. Esta ação não pode ser desfeita.",
        valueLabel: "Valor da transferência",
        confirmButton: "Confirmar Transferência",
        processingButton: "Realizando transferência...",
    },
};

export function ConfirmTransactionDialog({
    open,
    onOpenChange,
    onConfirm,
    isCreating = false,
    type,
    client,
    originClient,
    destinationClient,
    valor,
    moeda,
}: ConfirmTransactionDialogProps) {
    const currencyInfo = CURRENCIES.find((currency) => currency.code === moeda);
    const formattedValue = valor ? formatMoneyValue(valor) : "-";
    const config = TRANSACTION_CONFIG[type];

    // For transfer, use originClient and destinationClient; for deposit/withdrawal, use client
    const displayClient = type === "Transferencia" ? originClient : client;
    const displayDestinationClient = type === "Transferencia" ? destinationClient : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="mb-4">{config.title}</DialogTitle>
                    <DialogDescription>
                        {config.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mb-4">
                    {type === "Transferencia" ? (
                        <>
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-caption text-muted-foreground">Cliente origem</p>
                                <div className="flex flex-col items-end justify-end gap-1">
                                    <p className="text-foreground text-body font-bold">{displayClient?.nome ?? "-"}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">Client ID: </p>
                                        <p className="text-foreground text-caption">
                                            {displayClient?.id ? `${displayClient?.id?.slice(0, 4)}...${displayClient?.id?.slice(-4)}` : "-"}
                                        </p>
                                        <CopyButton textToCopy={displayClient?.id ?? ""} variant="secondary" size="small" disabled={!displayClient?.id} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-caption text-muted-foreground">Cliente destino</p>
                                <div className="flex flex-col items-end justify-end gap-1">
                                    <p className="text-foreground text-body font-bold">{displayDestinationClient?.nome ?? "-"}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">Client ID: </p>
                                        <p className="text-foreground text-caption">
                                            {displayDestinationClient?.id ? `${displayDestinationClient?.id?.slice(0, 4)}...${displayDestinationClient?.id?.slice(-4)}` : "-"}
                                        </p>
                                        <CopyButton textToCopy={displayDestinationClient?.id ?? ""} variant="secondary" size="small" disabled={!displayDestinationClient?.id} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-start justify-between gap-4">
                            <p className="text-caption text-muted-foreground">Cliente</p>
                            <div className="flex flex-col items-end justify-end gap-1">
                                <p className="text-foreground text-body font-bold">{displayClient?.nome ?? "-"}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">Client ID: </p>
                                    <p className="text-foreground text-caption">
                                        {displayClient?.id ? `${displayClient?.id?.slice(0, 4)}...${displayClient?.id?.slice(-4)}` : "-"}
                                    </p>
                                    <CopyButton textToCopy={displayClient?.id ?? ""} variant="secondary" size="small" disabled={!displayClient?.id} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-caption text-muted-foreground">{config.valueLabel}</p>
                        <p className="text-body text-foreground font-bold">
                            {moeda ? `${CURRENCIES.find((currency) => currency.code === moeda)?.symbol} ` : "$"} {formattedValue}
                        </p>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-caption text-muted-foreground">Moeda da transação</p>
                        <p className="text-body text-foreground font-bold">{currencyInfo?.fullName ?? "-"}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isCreating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>
                                <Spinner className="size-4" />
                                {config.processingButton}
                            </>
                        ) : (
                            config.confirmButton
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
