"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { clearClient } from "@/features/client/clientSlice";

import { LinkButton } from "@/components/ui/linkButton";
import { HeroTitle } from "@/components/ui/heroTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/transactions/transactionForm";
import { TransactionFeedback, type TransactionType as FeedbackTransactionType } from "@/components/transactions/transactionFeedback";

export default function NewTransactionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [formKey, setFormKey] = React.useState(0);

    const [transactionResult, setTransactionResult] = React.useState<{
        type: FeedbackTransactionType;
        isSuccess: boolean;
        errorMessage?: string;
    } | null>(null);

    React.useEffect(() => {
        dispatch(clearClient());
        setFormKey(prev => prev + 1);
    }, [dispatch]);

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
                <div className="flex flex-col gap-8 max-w-[1554px] mx-auto px-4 md:px-8 py-8 h-full mb-[820px]  md:mb-[440px]">
                    <Tabs 
                        defaultValue="transferencia" 
                        className="w-full h-full"
                        onValueChange={() => {
                            setFormKey(prev => prev + 1);
                            dispatch(clearClient());
                            setTransactionResult(null);
                        }}
                    >
                        <TabsList>
                            <TabsTrigger value="transferencia">Transferencia</TabsTrigger>
                            <TabsTrigger value="deposito">Deposito</TabsTrigger>
                            <TabsTrigger value="saque">Saque</TabsTrigger>
                        </TabsList>
                        <TabsContent value="transferencia" className="mt-4">
                            {transactionResult && transactionResult.type === "Transferencia" ? (
                                <TransactionFeedback
                                    type={transactionResult.type}
                                    isSuccess={transactionResult.isSuccess}
                                    errorMessage={"Faca uma nova transferência clicando no botão abaixo ou entre em contato com o suporte."}
                                    onReset={handleResetTransaction}
                                />
                            ) : (
                                <TransactionForm 
                                    key={formKey}
                                    type="Transferencia"
                                    onTransactionResult={(isSuccess, error) => {
                                        if (isSuccess) {
                                            setTransactionResult({
                                                type: "Transferencia",
                                                isSuccess: true,
                                            });
                                        } else {
                                            setTransactionResult({
                                                type: "Transferencia",
                                                isSuccess: false,
                                                errorMessage: error,
                                            });
                                        }
                                    }}
                                />
                            )}
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
                                <TransactionForm 
                                    key={formKey}
                                    type="Deposito"
                                    onTransactionResult={(isSuccess, error) => {
                                        if (isSuccess) {
                                            setTransactionResult({
                                                type: "Deposito",
                                                isSuccess: true,
                                            });
                                        } else {
                                            setTransactionResult({
                                                type: "Deposito",
                                                isSuccess: false,
                                                errorMessage: error,
                                            });
                                        }
                                    }}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="saque" className="mt-4 w-full">
                            {transactionResult && transactionResult.type === "Saque" ? (
                                <TransactionFeedback
                                    type={transactionResult.type}
                                    isSuccess={transactionResult.isSuccess}
                                    errorMessage={"Faca um novo saque clicando no botão abaixo ou entre em contato com o suporte."}
                                    onReset={handleResetTransaction}
                                />
                            ) : (
                                <TransactionForm 
                                    key={formKey}
                                    type="Saque"
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
