import { Button } from "@/components/ui/button";
import { HeroTitle } from "@/components/ui/heroTitle";
import { CardButton } from "@/components/ui/cardButton";
import Link from "next/link";
import { cookies } from "next/headers";
import { SectionTitle } from "@/components/ui/sectionTitle";

export default async function Home() {

  const token = (await cookies()).get('accessToken')?.value || null;
  const isAuthenticated = token !== null;

  return (
    <div className="flex flex-col items-start justify-center">
      <div className="w-full relative">
        <img src="/hero-image-1.jpg" alt="UBS Watchdog" className="h-[400px] w-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-start">
          <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
            <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full md:w-3/5 lg:w-2/5">
              <HeroTitle as="h1" subtitle="Sistema integrado de monitoração de transações financeiras">UBS Watchdog</HeroTitle>
              {isAuthenticated ?
                (<Link href="/transactions">
                  <Button variant="default" className="w-full md:w-auto mt-8">
                    Faça uma nova transação
                  </Button>
                </Link>)
              : (
                <Link href="/authentication/login">
                  <Button variant="default" className="w-full md:w-auto mt-8">
                    Faça seu login
                  </Button>
                </Link>
              )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start pt-10 h-full">
        <div className="px-4 md:px-8 py-10 max-w-[1554px] mx-auto w-full">
          <SectionTitle>O que é o UBS Watchdog?</SectionTitle>
          <p className="text-body text-muted-foreground">
            O UBS Watchdog é uma plataforma inteligente de compliance dedicada à detecção proativa de riscos financeiros. O sistema automatiza o monitoramento de transações para identificar padrões de fraude e lavagem de dinheiro em tempo real, substituindo processos manuais por alertas precisos e relatórios estratégicos para a tomada de decisão ágil.
          </p>
        </div>
        <div className="bg-secondary py-10 w-full h-fit">
          <div className="max-w-[1554px] mx-auto px-4 md:px-8">
            <SectionTitle>Serviços disponíveis</SectionTitle>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/transactions">
                <CardButton icon="/services-transaction.jpg" title="Realização de transações" description="Monitoração de transações financeiras em tempo real" />
              </Link>
              <Link href="/compliance">
                <CardButton icon="/services-compliance.jpg" title="Monitoramento de conformidade" description="Monitoração de transações financeiras em tempo real" />
              </Link>
              <Link href="/report">
                <CardButton icon="/services-report.jpg" title="Análise de relatórios" description="Monitoração de transações financeiras em tempo real" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
