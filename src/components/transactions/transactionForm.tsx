"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import { createTransaction, selectTransactionCreating } from "@/features/transactions/transactionsSlice";
import { getClientsAPI, type Client } from "@/features/client/clientAPI";
import { CURRENCIES } from "@/models/transactions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flagImage";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/ui/copyButton";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { fetchClientById, selectCurrentClient, selectCurrentClientLoading, clearClient, selectContraparteClient, selectContraparteClientLoading } from "@/features/client/clientSlice";
import { ConfirmTransactionDialog } from "@/components/transactions/confirmTransactionDialog";

export type TransactionType = "Deposito" | "Saque" | "Transferencia";

function formatMoneyValue(value: number | string): string {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : value;
    if (isNaN(numValue)) return "";
    const formatted = numValue.toFixed(2).replace(".", ",");
    const parts = formatted.split(",");
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+$)/g, "$1.");
    return parts.join(",");
}

function parseMoneyValue(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
}

const TRANSACTION_CONFIG = {
    Deposito: {
        sectionTitle: "Informações do depósito",
        clientLabel: "Cliente",
        destinationLabel: "Cliente destino",
        valueLabel: "Valor do depósito",
        submitButton: "Realizar Depósito",
        icon: "banknote-arrow-down" as const,
    },
    Saque: {
        sectionTitle: "Informações do saque",
        clientLabel: "Cliente",
        destinationLabel: "Cliente destino",
        valueLabel: "Valor do saque",
        submitButton: "Realizar Saque",
        icon: "banknote-arrow-up" as const,
    },
    Transferencia: {
        sectionTitle: "Informações da transferência",
        clientLabel: "Cliente origem",
        destinationLabel: "Cliente destino",
        valueLabel: "Valor da transferência",
        submitButton: "Realizar Transferência",
        icon: "banknote-arrow-up" as const,
    },
};

interface TransactionFormProps {
    type: TransactionType;
    onDialogOpenChange?: (open: boolean) => void;
    onFormSubmit?: (data: { clienteId: string; moeda: string; valor: string; contraparteId?: string | null }) => void;
    onTransactionResult?: (isSuccess: boolean, error?: string) => void;
}

export function TransactionForm({
    type,
    onDialogOpenChange,
    onFormSubmit,
    onTransactionResult
}: TransactionFormProps) {
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const isCreating = useAppSelector(selectTransactionCreating);
    const client = useAppSelector(selectCurrentClient);
    const contraparteClient = useAppSelector(selectContraparteClient);
    const isLoadingClient = useAppSelector(selectCurrentClientLoading);
    const isLoadingContraparte = useAppSelector(selectContraparteClientLoading);

    const config = TRANSACTION_CONFIG[type];
    const isTransfer = type === "Transferencia";

    const [clients, setClients] = React.useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = React.useState(false);
    const [clienteId, setClienteId] = React.useState<string>("");
    const [moeda, setMoeda] = React.useState<string>("");
    const [valor, setValor] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);
    const [contraparte, setContraparte] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (!token) return;

        const fetchClients = async () => {
            setLoadingClients(true);
            try {
                const clientsData = await getClientsAPI({ token });
                if (clientsData) {
                    setClients(clientsData);
                }
            } catch (err) {
                console.error("Failed to fetch clients:", err);
            } finally {
                setLoadingClients(false);
            }
        };

        fetchClients();
    }, [token]);

    React.useEffect(() => {
        if (clienteId && token) {
            dispatch(fetchClientById({ clientId: clienteId, token }));
        } else if (!clienteId && type === "Deposito") {
            dispatch(clearClient());
        }
    }, [clienteId, token, dispatch, type]);

    React.useEffect(() => {
        if (isTransfer && contraparte && token) {
            dispatch(fetchClientById({ clientId: contraparte, token, contraparte: true }));
        }
    }, [isTransfer, contraparte, token, dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!clienteId || !moeda || !valor || !token) {
            setError("Por favor, preencha todos os campos");
            return;
        }

        const valorNumber = parseMoneyValue(valor);
        if (isNaN(valorNumber) || valorNumber <= 0) {
            setError("Por favor, insira um valor válido maior que zero");
            return;
        }

        if (isTransfer && !contraparte) {
            setError("Por favor, selecione uma contraparte");
            return;
        }

        if (onFormSubmit) {
            onFormSubmit({ clienteId, moeda, valor, contraparteId: isTransfer ? contraparte : null });
            if (onDialogOpenChange) {
                onDialogOpenChange(true);
            }
        } else {
            setIsDialogOpen(true);
        }
    };

    const handleConfirmTransaction = async () => {
        setError(null);

        if (!clienteId || !moeda || !valor || !token) {
            setError("Por favor, preencha todos os campos");
            setIsDialogOpen(false);
            return;
        }

        const valorNumber = parseMoneyValue(valor);
        if (isNaN(valorNumber) || valorNumber <= 0) {
            setError("Por favor, insira um valor válido maior que zero");
            setIsDialogOpen(false);
            return;
        }

        if (isTransfer && !contraparte) {
            setError("Por favor, selecione uma contraparte");
            setIsDialogOpen(false);
            return;
        }

        const result = await dispatch(
            createTransaction({
                transaction: {
                    clienteId,
                    tipo: type,
                    valor: parseFloat(valorNumber.toFixed(2)),
                    moeda,
                    contraparteId: isTransfer ? contraparte : null,
                },
                token,
            })
        );

        if (createTransaction.fulfilled.match(result)) {
            setClienteId("");
            setMoeda("");
            setValor("");
            setContraparte(null);
            dispatch(clearClient());
            setIsDialogOpen(false);
            if (onTransactionResult) {
                onTransactionResult(true);
            }
        } else {
            const errorMsg = "Falha ao criar a transação. Por favor, tente novamente.";
            setError(errorMsg);
            setIsDialogOpen(false);
            if (onTransactionResult) {
                onTransactionResult(false, errorMsg);
            }
        }
    };

    const isValid = Boolean(clienteId && moeda && valor && parseMoneyValue(valor) > 0 && (!isTransfer || contraparte));

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/[^\d,]/g, "");
        const parts = inputValue.split(",");
        if (parts.length > 2) {
            inputValue = parts[0] + "," + parts.slice(1).join("");
        }
        const updatedParts = inputValue.split(",");
        if (updatedParts.length === 2 && updatedParts[1].length > 2) {
            inputValue = updatedParts[0] + "," + updatedParts[1].slice(0, 2);
        }

        setValor(inputValue);
    };

    const handleValorBlur = () => {
        if (valor) {
            const numValue = parseMoneyValue(valor);
            if (!isNaN(numValue) && numValue > 0) {
                setValor(formatMoneyValue(numValue));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-12 py-10 items-center md:items-center md:justify-center">
            <div className="flex flex-col gap-6 w-full md:max-w-md">
                <div className="flex flex-col gap-2">
                    <label htmlFor="cliente" className="text-sm font-regular text-foreground">
                        {config.clientLabel}
                    </label>
                    <Select value={clienteId} onValueChange={setClienteId} disabled={loadingClients}>
                        <SelectTrigger id="cliente" className="w-full" icon={config.icon}>
                            <SelectValue placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                    {client.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isTransfer && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="contraparte" className="text-sm font-regular text-foreground">
                            {config.destinationLabel}
                        </label>
                        <Select value={contraparte ?? undefined} onValueChange={(value) => setContraparte(value ?? null)} disabled={loadingClients}>
                            <SelectTrigger id="contraparte" className="w-full" icon="banknote-arrow-down">
                                <SelectValue placeholder={loadingClients ? "Carregando contrapartes..." : "Selecione um cliente destino"} />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label htmlFor="moeda" className="text-sm font-regular text-foreground">
                        Moeda
                    </label>
                    <Select value={moeda} onValueChange={setMoeda}>
                        <SelectTrigger id="moeda" className="w-full">
                            <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    <div className="flex items-center gap-2">
                                        <FlagImage country={currency.countryCode} className="size-4" />
                                        <span>{currency.code} - {currency.fullName}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="valor" className="text-sm font-regular text-foreground">
                        Valor
                    </label>
                    <Input
                        id="valor"
                        name="valor"
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        prefix={moeda ? `${CURRENCIES.find((currency) => currency.code === moeda)?.symbol ?? ""} ` : "$"}
                        value={valor}
                        onChange={handleValorChange}
                        onBlur={handleValorBlur}
                        validationRule={(val) => {
                            if (!val) return "Valor é obrigatório";
                            const num = parseMoneyValue(val);
                            if (isNaN(num)) return "Valor deve ser um número válido";
                            if (num <= 0) return "Valor deve ser maior que zero";
                            return true;
                        }}
                    />
                </div>

                {error && (
                    <div className="text-sm text-destructive">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full md:max-w-md">
                <SectionTitle>{config.sectionTitle}</SectionTitle>
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">
                            {isTransfer ? "Cliente origem" : "Cliente"}
                        </p>
                        <div className="flex flex-col items-end justify-end gap-1">
                            {isLoadingClient ? (
                                <div className="flex flex-col items-end gap-1">
                                    <Skeleton className="w-40 h-6" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-foreground text-body font-bold text-right">{client?.nome ?? "-"}</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <p className="text-xs text-muted-foreground">Client ID: </p>
                                        <p className="text-foreground text-caption text-right">{client?.id ? `${client?.id?.slice(0, 4)}...${client?.id?.slice(-4)}` : "-"}</p>
                                        <CopyButton textToCopy={client?.id ?? ""} variant="secondary" size="small" disabled={!client?.id} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {isTransfer && (
                        <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                            <p className="text-caption text-muted-foreground">Cliente destino</p>
                            <div className="flex flex-col items-end justify-end gap-1">
                                {isLoadingContraparte ? (
                                    <div className="flex flex-col items-end gap-1">
                                        <Skeleton className="w-40 h-6" />
                                        <Skeleton className="w-32 h-4" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-foreground text-body font-bold text-right">{contraparteClient?.nome ?? "-"}</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <p className="text-xs text-muted-foreground">Client ID: </p>
                                            <p className="text-foreground text-caption text-right">{contraparteClient?.id ? `${contraparteClient?.id?.slice(0, 4)}...${contraparteClient?.id?.slice(-4)}` : "-"}</p>
                                            <CopyButton textToCopy={contraparteClient?.id ?? ""} variant="secondary" size="small" disabled={!contraparteClient?.id} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">{config.valueLabel}</p>
                        <p className="text-body text-foreground font-bold"> {moeda ? `${CURRENCIES.find((currency) => currency.code === moeda)?.symbol} ` : "$"} {valor ? formatMoneyValue(valor) : "-"}</p>
                    </div>
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">Moeda da transação</p>
                        <p className="text-body text-foreground font-bold"> {CURRENCIES.find((currency) => currency.code === moeda)?.fullName ?? "-"}</p>
                    </div>
                </div>
                <Button type="submit" disabled={!isValid || isCreating} className="mt-6 w-full">
                    {config.submitButton}
                </Button>
            </div>

            <ConfirmTransactionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleConfirmTransaction}
                isCreating={isCreating}
                type={type}
                client={!isTransfer ? client : undefined}
                originClient={isTransfer ? client : undefined}
                destinationClient={isTransfer ? contraparteClient : undefined}
                valor={valor}
                moeda={moeda}
            />
        </form>
    );
}
