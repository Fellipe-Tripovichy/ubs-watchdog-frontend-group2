"use client"

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";

export default function LoginPage() {
    function handleScrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        // Handle login logic here
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1554px] mx-auto px-8 py-10 h-full min-h-screen">
                <div className="flex items-center justify-center ">
                    <div className="flex flex-col items-start justify-start md:max-w-md w-full md:min-w-[400px]">
                        <Link href="/" className="mb-6">
                            <LinkButton icon="chevron-left" iconLeft={true}>
                                Voltar
                            </LinkButton>
                        </Link>
                        <h1 className="text-[28px] md:text-[40px] font-regular text-secondary-foreground">Login</h1>
                        <div className="h-1 w-20 bg-primary mt-3"></div>
                        <p className="text-[16px] text-muted-foreground mt-6">
                            Faça login para acessar o UBS Watchdog e gerenciar suas transações financeiras.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="bg-accent p-8 rounded-md md:max-w-md w-full md:min-w-[400px]">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

                            <Button type="submit" className="w-full mt-2">
                                Entrar
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Não tem uma conta?{" "}
                                <Link href="/authentication/registration" className="text-primary hover:underline">
                                    Cadastre-se
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

