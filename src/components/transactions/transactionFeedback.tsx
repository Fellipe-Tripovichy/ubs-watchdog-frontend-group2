"use client";

import React from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export type TransactionType = "Deposito" | "Saque" | "Transferencia";

interface TransactionFeedbackProps {
    type: TransactionType;
    isSuccess: boolean;
    onReset: () => void;
    errorMessage?: string;
}

const transactionMessages = {
    Deposito: {
        success: {
            title: "Depósito Realizado com Sucesso!",
            description: "O depósito foi processado com sucesso. A transação foi registrada e o valor foi creditado na conta do cliente.",
        },
        error: {
            title: "Falha ao Realizar Depósito",
            description: "Não foi possível processar o depósito. Por favor, verifique os dados e tente novamente.",
        },
    },
    Saque: {
        success: {
            title: "Saque Realizado com Sucesso!",
            description: "O saque foi processado com sucesso. A transação foi registrada e o valor foi debitado da conta do cliente.",
        },
        error: {
            title: "Falha ao Realizar Saque",
            description: "Não foi possível processar o saque. Por favor, verifique os dados e tente novamente.",
        },
    },
    Transferencia: {
        success: {
            title: "Transferência Realizada com Sucesso!",
            description: "A transferência foi processada com sucesso. A transação foi registrada e o valor foi transferido entre as contas.",
        },
        error: {
            title: "Falha ao Realizar Transferência",
            description: "Não foi possível processar a transferência. Por favor, verifique os dados e tente novamente.",
        },
    },
};

export function TransactionFeedback({
    type,
    isSuccess,
    onReset,
    errorMessage,
}: TransactionFeedbackProps) {
    const messages = transactionMessages[type];
    const message = isSuccess ? messages.success : messages.error;

    return (
        <div className="w-full flex items-center justify-center py-10">
            <Card className="w-full rounded-xs border-dashed shadow-none">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {isSuccess ? (
                            <CheckCircle2Icon className="size-16 text-success-foreground" />
                        ) : (
                            <XCircleIcon className="size-16 text-destructive" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">{message.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                        {errorMessage || message.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button onClick={onReset} variant="default" className="w-full md:w-auto">
                        Nova {type === "Deposito" ? "Transação" : type === "Saque" ? "Transação" : "Transferência"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
