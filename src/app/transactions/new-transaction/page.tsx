"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
    selectTransactionsError,
} from "@/features/transactions/transactionsSlice";
import { clearClient } from "@/features/client/clientSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { HeroTitle } from "@/components/ui/heroTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionWithdrawalForm } from "@/components/transactions/transactionWithdrawalForm";
import { TransactionDepositForm } from "@/components/transactions/transactionDepositForm";
import { ConfirmDepositDialog } from "@/components/transactions/confirmDepositDialog";
import { TransactionFeedback, type TransactionType as FeedbackTransactionType } from "@/components/transactions/transactionFeedback";
import { createTransaction, selectTransactionCreating } from "@/features/transactions/transactionsSlice";
import { selectCurrentClient } from "@/features/client/clientSlice";

export default function NewTransactionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectToken);
    const transactionsError = useAppSelector(selectTransactionsError);
    const [formKey, setFormKey] = React.useState(0);

    const [transactionResult, setTransactionResult] = React.useState<{
        type: FeedbackTransactionType;
        isSuccess: boolean;
        errorMessage?: string;
    } | null>(null);

    const isCreatingDeposit = useAppSelector(selectTransactionCreating);
    const depositClient = useAppSelector(selectCurrentClient);
    const [isDepositDialogOpen, setIsDepositDialogOpen] = React.useState(false);
    const [depositFormData, setDepositFormData] = React.useState<{ clienteId: string; moeda: string; valor: string } | null>(null);

    React.useEffect(() => {
        dispatch(clearClient());
        setFormKey(prev => prev + 1);
    }, [dispatch]);

    const parseMoneyValue = (value: string): number => {
        if (!value) return 0;
        const cleaned = value.replace(/\./g, "").replace(",", ".");
        return parseFloat(cleaned) || 0;
    };

    const handleConfirmDeposit = async () => {
        if (!depositFormData || !token) return;

        const valorNumber = parseMoneyValue(depositFormData.valor);
        if (isNaN(valorNumber) || valorNumber <= 0) {
            setIsDepositDialogOpen(false);
            return;
        }

        const result = await dispatch(
            createTransaction({
                transaction: {
                    clienteId: depositFormData.clienteId,
                    tipo: "Deposito",
                    valor: parseFloat(valorNumber.toFixed(2)),
                    moeda: depositFormData.moeda,
                    contraparte: {
                        nome: "",
                        pais: "",
                    },
                },
                token,
            })
        );

        if (createTransaction.fulfilled.match(result)) {
            setIsDepositDialogOpen(false);
            setDepositFormData(null);
            dispatch(clearClient());
            setTransactionResult({
                type: "Deposito",
                isSuccess: true,
            });
        } else {
            setIsDepositDialogOpen(false);
            const error = transactionsError || "Falha ao criar a transação. Por favor, tente novamente.";
            setTransactionResult({
                type: "Deposito",
                isSuccess: false,
                errorMessage: error,
            });
        }
    };

    const handleResetTransaction = () => {
        setTransactionResult(null);
        dispatch(clearClient());
        setFormKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col items-start w-full">
            <div className="w-full">
                <div className="w-full flex items-center jsustify-start">
                    <div className="flex flex-col items-start justify-start w-full max-w-[1554px] mx-auto">
                        <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full">
                            <LinkButton icon="chevron-left" iconLeft={true} onClick={() => router.back()} className="mb-4">
                                Voltar
                            </LinkButton>
                            <HeroTitle as="h1" subtitle="Trasnferência, depósito ou saque">Nova Transação</HeroTitle>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8 h-full md:mb-[360px]">
                    <Tabs defaultValue="transferencia" className="w-full h-full">
                        <TabsList>
                            <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
                            <TabsTrigger value="deposito">Deposito</TabsTrigger>
                            <TabsTrigger value="saque">Saque</TabsTrigger>
                        </TabsList>
                        <TabsContent value="transferencia" className="mt-4">

                        </TabsContent>
                        <TabsContent value="deposito" className="mt-4 w-full ">
                            {transactionResult && transactionResult.type === "Deposito" ? (
                                <TransactionFeedback
                                    type={transactionResult.type}
                                    isSuccess={transactionResult.isSuccess}
                                    errorMessage={"Faca um novo deposito clicando no botão abaixo ou entre em contato com o suporte."}
                                    onReset={handleResetTransaction}
                                />
                            ) : (
                                <>
                                    <TransactionDepositForm 
                                        key={formKey} 
                                        onDialogOpenChange={setIsDepositDialogOpen}
                                        onFormSubmit={(data) => setDepositFormData(data)}
                                    />
                                    <ConfirmDepositDialog
                                        open={isDepositDialogOpen}
                                        onOpenChange={setIsDepositDialogOpen}
                                        onConfirm={handleConfirmDeposit}
                                        isCreating={isCreatingDeposit}
                                        client={depositClient}
                                        valor={depositFormData?.valor ?? ""}
                                        moeda={depositFormData?.moeda ?? ""}
                                    />
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="saque" className="mt-4 w-full h-full">
                            {transactionResult && transactionResult.type === "Saque" ? (
                                <TransactionFeedback
                                    type={transactionResult.type}
                                    isSuccess={transactionResult.isSuccess}
                                    errorMessage={"Faca um novo saque clicando no botão abaixo ou entre em contato com o suporte."}
                                    onReset={handleResetTransaction}
                                />
                            ) : (
                                <TransactionWithdrawalForm 
                                    key={formKey}
                                    onTransactionResult={(isSuccess, error) => {
                                        if (isSuccess) {
                                            setTransactionResult({
                                                type: "Saque",
                                                isSuccess: true,
                                            });
                                        } else {
                                            setTransactionResult({
                                                type: "Saque",
                                                isSuccess: false,
                                                errorMessage: error,
                                            });
                                        }
                                    }}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
