"use client"

export default function compliancePage() {
  function handleScrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="flex flex-col items-start min-h-screen w-full">
        <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-[28px] md:text-[40px] font-regular text-secondary-foreground">Conformidade</h1>
              <div className="h-1 w-20 bg-primary mt-3"></div>
              <p className="text-[16px] text-muted-foreground mt-6">
                Monitoramento de conformidade e detecção proativa de riscos financeiros. Identifique padrões de fraude e lavagem de dinheiro em tempo real.
              </p>
            </div>

            <div className="bg-accent p-8 rounded-md">
              <h2 className="text-[24px] font-regular text-secondary-foreground mb-4">Funcionalidades</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Monitoramento contínuo de conformidade</li>
                <li>Detecção de padrões suspeitos</li>
                <li>Alertas em tempo real</li>
                <li>Análise de risco automatizada</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
  );
}

