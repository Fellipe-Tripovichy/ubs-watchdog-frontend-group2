"use client"

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/heroTitle";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/utils";
import React from "react";
import { login, selectLoading } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    const dispatch = useAppDispatch();

    const router = useRouter();

    const [responseStatus, setResponseStatus] = React.useState("waitingSubmission");
    const loading = useAppSelector(selectLoading);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));

        if (login.fulfilled.match(result)) {
            router.push("/");
        } else {
            setResponseStatus("error");
        }
    }

    const [isValid, setIsValid] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        setIsValid(validateEmail(email) && password.length >= 8);
    }, [email, password]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="bg-accent/90 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-8 max-w-[1554px] mx-auto w-11/12 px-8 py-10 z-2">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-start md:max-w-md w-full md:min-w-[400px] pb-14">
                        <Link href="/" className="mb-6">
                            <LinkButton icon="chevron-left" iconLeft={true}>
                                Voltar para o início
                            </LinkButton>
                        </Link>
                        <HeroTitle as="h1" subtitle="Faça login para acessar o UBS Watchdog e gerenciar suas transações financeiras.">Login</HeroTitle>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="md:max-w-md w-full md:min-w-[400px]">
                        {responseStatus === "waitingSubmission" && (
                            <>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-regular text-secondary-foreground">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="seu@email.com"
                                            validationRule={validateEmail}
                                            errorMessage="Email inválido"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password" className="text-sm font-regular text-secondary-foreground">
                                            Senha
                                        </label>
                                        <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" disabled={!isValid} className="w-full mt-2">
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Spinner className="size-4 text-primary-foreground" />
                                                <span>Entrando...</span>
                                            </div>
                                        ) : "Entrar"}
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
                            </>
                        )}
                        {responseStatus === "error" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-secondary-foreground">Erro ao fazer login!</h3>
                                <p className="text-sm text-muted-foreground">Por favor, tente novamente ou contate o suporte.</p>
                                <Link href="/authentication/login">
                                    <Button variant="default" className="w-full mt-2">
                                        Voltar para o login
                                    </Button>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <div className="w-full h-full absolute top-0 left-0">
                <img src="/bg-authentication.jpg" alt="background" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

