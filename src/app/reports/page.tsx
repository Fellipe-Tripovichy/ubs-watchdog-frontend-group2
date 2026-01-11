"use client"

export default function ReportsPage() {
  return (
    <div className="flex flex-col items-start  w-full">
      <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-[28px] md:text-[40px] font-regular text-foreground">Relatórios</h1>
            <div className="h-1 w-20 bg-primary mt-3"></div>
            <p className="text-[16px] text-muted-foreground mt-6">
              Análise de relatórios estratégicos para tomada de decisão ágil. Visualize insights e métricas importantes do sistema.
            </p>
          </div>
          <div className="bg-secondary p-8 rounded-md">
            <h2 className="text-[24px] font-regular text-secondary-foreground mb-4">Funcionalidades</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Geração de relatórios personalizados</li>
              <li>Visualização de métricas e KPIs</li>
              <li>Exportação em múltiplos formatos</li>
              <li>Análise histórica de dados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

