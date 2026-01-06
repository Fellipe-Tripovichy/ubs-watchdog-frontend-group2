"use client"

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/heroTitle";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/utils";
import React from "react";
import { login, resetPassword, selectLoading } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    const dispatch = useAppDispatch();

    const [responseStatus, setResponseStatus] = React.useState("waitingSubmission");
    const [showResetPassword, setShowResetPassword] = React.useState(false);
    const loading = useAppSelector(selectLoading);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));

        if (login.fulfilled.match(result)) {
            globalThis.location.reload();
        } else {
            setResponseStatus("error");
        }
    }

    async function handleResetPassword(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const result = await dispatch(resetPassword(email));
        if (resetPassword.fulfilled.match(result)) {
            setResponseStatus("successResetPassword");
        } else {
            setResponseStatus("errorResetPassword");
        }
    }

    const [isValid, setIsValid] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        if (showResetPassword) {
            setIsValid(validateEmail(email));
        } else {
            setIsValid(validateEmail(email) && password.length >= 8);
        }
    }, [email, password, showResetPassword]);

    const getButtonContent = () => {
        if (loading) {
            if (showResetPassword) {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Spinner className="size-4 text-primary-foreground" />
                        <span>Resetando senha...</span>
                    </div>
                );
            }
            return (
                <div className="flex items-center justify-center gap-2">
                    <Spinner className="size-4 text-primary-foreground" />
                    <span>Entrando...</span>
                </div>
            );
        }
        if (showResetPassword) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <span>Recuperar senha</span>
                </div>
            );
        }
        return "Entrar";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="bg-card/95 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-8 max-w-[1554px] mx-auto w-11/12 px-8 py-10 z-2">
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
                                <form onSubmit={showResetPassword ? handleResetPassword : handleSubmit} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-regular text-foreground">
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

                                    {!showResetPassword && (
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="password" className="text-sm font-regular text-foreground">
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
                                    )}

                                    <Button type="submit" disabled={!isValid} className="w-full mt-2">
                                        {getButtonContent()}
                                    </Button>
                                </form>
                                {!showResetPassword && <div className="mt-2 text-center pb-6 border-b border-border">
                                    <p className="text-sm text-muted-foreground">
                                        Não lembra sua senha?{" "}
                                        <button
                                            type="button"
                                            className="text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit"
                                            onClick={() => setShowResetPassword(true)}
                                        >
                                            Recuperar senha
                                        </button>
                                    </p>
                                </div>}
                                {!showResetPassword && <div className="mt-6 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Não tem uma conta?{" "}
                                        <Link href="/authentication/registration" className="text-primary hover:underline">
                                            Cadastre-se
                                        </Link>
                                    </p>
                                </div>}
                            </>
                        )}
                        {responseStatus === "error" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-foreground">Erro ao fazer login!</h3>
                                <p className="text-sm text-muted-foreground mb-4">Por favor, tente novamente ou contate o suporte.</p>
                                <Button variant="default" className="w-full mt-2" onClick={() => globalThis.location.reload()}>
                                    Voltar para o login
                                </Button>
                            </div>
                        )}
                        {responseStatus === "successResetPassword" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-foreground">Senha resetada com sucesso!</h3>
                                <p className="text-sm text-muted-foreground mb-4">Verifique seu email para mais informações.</p>
                                <Button variant="default" className="w-full mt-2" onClick={() => globalThis.location.reload()}>
                                    Voltar para o login
                                </Button>
                            </div>
                        )}
                        {responseStatus === "errorResetPassword" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-foreground">Erro ao resetar senha!</h3>
                                <p className="text-sm text-muted-foreground mb-4">Por favor, tente novamente ou contate o suporte.</p>
                                <Button variant="default" className="w-full mt-2" onClick={() => globalThis.location.reload()}>
                                    Voltar para o login
                                </Button>
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

