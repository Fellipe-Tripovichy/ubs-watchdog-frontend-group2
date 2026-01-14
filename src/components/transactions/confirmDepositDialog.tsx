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

interface ConfirmDepositDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isCreating?: boolean;
    client: Client | null;
    valor: string;
    moeda: string;
}

function formatMoneyValue(value: number | string): string {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : value;
    if (isNaN(numValue)) return "";
    const formatted = numValue.toFixed(2).replace(".", ",");
    const parts = formatted.split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}

export function ConfirmDepositDialog({
    open,
    onOpenChange,
    onConfirm,
    isCreating = false,
    client,
    valor,
    moeda,
}: ConfirmDepositDialogProps) {
    const currencyInfo = CURRENCIES.find((currency) => currency.code === moeda);
    const formattedValue = valor ? formatMoneyValue(valor) : "-";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="mb-4">Confirmar Depósito</DialogTitle>
                    <DialogDescription>
                        Revise as informações do depósito antes de confirmar. Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-caption text-muted-foreground">Cliente</p>
                        <div className="flex flex-col items-end justify-end gap-1">
                            <p className="text-foreground text-body font-bold">{client?.nome ?? "-"}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Client ID: </p>
                                <p className="text-foreground text-caption">
                                    {client?.id ? `${client?.id?.slice(0, 4)}...${client?.id?.slice(-4)}` : "-"}
                                </p>
                                <CopyButton textToCopy={client?.id ?? ""} variant="secondary" size="small" disabled={!client?.id} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-caption text-muted-foreground">Valor do depósito</p>
                        <p className="text-body text-foreground font-bold">
                            {moeda ? `${moeda} ` : "$"} {formattedValue}
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
                                Realizando depósito...
                            </>
                        ) : (
                            "Confirmar Depósito"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
