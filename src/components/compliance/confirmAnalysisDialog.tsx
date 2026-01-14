"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isUpdating?: boolean;
}

export function ConfirmAnalysisDialog({
    open,
    onOpenChange,
    onConfirm,
    isUpdating = false,
}: ConfirmAnalysisDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="mb-4">Confirmar Início de Análise</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja iniciar a análise deste alerta? Esta ação irá alterar o status do alerta para "Em Análise".
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Processando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
