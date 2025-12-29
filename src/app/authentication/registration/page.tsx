"use client"

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";

export default function RegistrationPage() {
  function handleScrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Handle registration logic here
  }

  return (
    <div className="flex flex-col items-start min-h-screen w-full">
      <div className="w-full max-w-[1554px] mx-auto px-8 py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-[28px] md:text-[40px] font-regular text-secondary-foreground">Cadastro</h1>
            <div className="h-1 w-20 bg-primary mt-3"></div>
            <p className="text-[16px] text-muted-foreground mt-6">
              Crie sua conta para começar a usar o UBS Watchdog e monitorar suas transações financeiras.
            </p>
          </div>

          <div className="bg-accent p-8 rounded-md max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-secondary-foreground">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-secondary-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-secondary-foreground">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-secondary-foreground">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full mt-2">
                Cadastrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/authentication/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

