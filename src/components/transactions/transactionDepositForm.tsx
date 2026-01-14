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
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/ui/copyButton";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { fetchClientById, selectCurrentClient, selectCurrentClientLoading, clearClient } from "@/features/client/clientSlice";

function formatMoneyValue(value: number | string): string {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : value;
    if (isNaN(numValue)) return "";
    const formatted = numValue.toFixed(2).replace(".", ",");
    const parts = formatted.split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}

function parseMoneyValue(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
}

interface TransactionDepositFormProps {
    onDialogOpenChange?: (open: boolean) => void;
    onFormSubmit?: (data: { clienteId: string; moeda: string; valor: string }) => void;
}

export function TransactionDepositForm({ onDialogOpenChange, onFormSubmit }: TransactionDepositFormProps) {
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const isCreating = useAppSelector(selectTransactionCreating);
    const client = useAppSelector(selectCurrentClient);
    const isLoadingClient = useAppSelector(selectCurrentClientLoading);

    const [clients, setClients] = React.useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = React.useState(false);
    const [clienteId, setClienteId] = React.useState<string>("");
    const [moeda, setMoeda] = React.useState<string>("");
    const [valor, setValor] = React.useState<string>("");
    const [error, setError] = React.useState<string | null>(null);

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
        }
    }, [clienteId, token, dispatch]);

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

        if (onDialogOpenChange) {
            onDialogOpenChange(true);
        }
        if (onFormSubmit) {
            onFormSubmit({ clienteId, moeda, valor });
        }
    };

    const isValid = Boolean(clienteId && moeda && valor && parseMoneyValue(valor) > 0);

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
        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-12 py-10 items-center md:items-center md:justify-center ">
            <div className="flex flex-col gap-6 w-full md:max-w-md">
                <div className="flex flex-col gap-2">
                    <label htmlFor="cliente" className="text-sm font-regular text-foreground">
                        Cliente
                    </label>
                    <Select value={clienteId} onValueChange={setClienteId} disabled={loadingClients}>
                        <SelectTrigger id="cliente" className="w-full">
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
                        prefix={moeda ? `${moeda} ` : "$"}
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
                <SectionTitle>Informações do depósito</SectionTitle>
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">Informações do cliente</p>
                        <div className="flex flex-col items-end justify-end gap-1">
                            {isLoadingClient ? (
                                <Skeleton className="w-full h-6" />
                            ) : (
                                <p className="text-foreground text-body font-bold">{client?.nome ?? "-"}</p>
                            )}
                            {isLoadingClient ? (
                                <Skeleton className="w-1/2 h-4" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">Client ID: </p>
                                    <p className="text-foreground text-caption">{client?.id ? `${client?.id?.slice(0, 4)}...${client?.id?.slice(-4)}` : "-"}</p>
                                    <CopyButton textToCopy={client?.id ?? ""} variant="secondary" size="small" disabled={!client?.id} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">Valor do depósito</p>
                        <p className="text-body text-foreground font-bold"> {moeda ?? "$"} {valor ? formatMoneyValue(valor) :  "-"}</p>
                    </div>
                    <div className="flex items-start justify-between gap-4 bg-secondary p-4 rounded-xs">
                        <p className="text-caption text-muted-foreground">Moeda da transação</p>
                        <p className="text-body text-foreground font-bold"> {CURRENCIES.find((currency) => currency.code === moeda)?.fullName ?? "-"}</p>
                    </div>
                </div>
                <Button type="submit" disabled={!isValid || isCreating} className="mt-6 w-full">
                    Realizar Depósito
                </Button>
            </div>
        </form>
    );
}
