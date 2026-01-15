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
import { Textarea } from "@/components/ui/textarea";

interface ConfirmResolutionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (resolucao: string) => void;
    isUpdating?: boolean;
}

export function ConfirmResolutionDialog({
    open,
    onOpenChange,
    onConfirm,
    isUpdating = false,
}: ConfirmResolutionDialogProps) {
    const [resolucao, setResolucao] = React.useState("");

    const handleConfirm = () => {
        if (resolucao.trim()) {
            onConfirm(resolucao.trim());
            setResolucao("");
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setResolucao("");
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="mb-4">Resolver Alerta</DialogTitle>
                    <DialogDescription>
                        Descreva como o alerta foi resolvido. Esta ação irá alterar o status do alerta para "Resolvido".
                    </DialogDescription>
                </DialogHeader>
                <div className="mb-4">
                    <Textarea
                        placeholder="Descreva a resolução do alerta..."
                        value={resolucao}
                        onChange={(e) => setResolucao(e.target.value)}
                        disabled={isUpdating}
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => handleOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isUpdating || !resolucao.trim()}
                    >
                        {isUpdating ? "Processando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
