"use client"

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/linkButton";

export default function TransactionsPage() {
  function handleScrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-start min-h-screen w-full">
      <div className="w-full max-w-[1554px] mx-auto px-8 py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-[28px] md:text-[40px] font-regular text-secondary-foreground">Transações</h1>
            <div className="h-1 w-20 bg-primary mt-3"></div>
            <p className="text-[16px] text-muted-foreground mt-6">
              Monitoração de transações financeiras em tempo real. Visualize, analise e gerencie todas as transações do sistema.
            </p>
          </div>

          <div className="bg-accent p-8 rounded-md">
            <h2 className="text-[24px] font-regular text-secondary-foreground mb-4">Funcionalidades</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Visualização de transações em tempo real</li>
              <li>Filtros avançados de busca</li>
              <li>Exportação de dados</li>
              <li>Detecção automática de anomalias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

