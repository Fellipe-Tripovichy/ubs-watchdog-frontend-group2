"use client"

import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/heroTitle";
import { Input } from "@/components/ui/input";
import React from "react";
import { validateEmail } from "@/lib/utils";
import { createUser, selectLoading } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Spinner } from "@/components/ui/spinner";

export default function RegistrationPage() {
    const dispatch = useAppDispatch();

    const [responseStatus, setResponseStatus] = React.useState("waitingSubmission");
    const loading = useAppSelector(selectLoading);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        const result = await dispatch(createUser({ email, password, name }));

        if (createUser.fulfilled.match(result)) {
            setResponseStatus("success");
        } else {
            setResponseStatus("error");
        }
    }

    const [isValid, setIsValid] = React.useState(false);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    React.useEffect(() => {
        setIsValid(name.length > 0 && validateEmail(email) && password.length >= 8 && confirmPassword === password);
    }, [email, password, confirmPassword]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="bg-card/95 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-8 max-w-[1554px] mx-auto w-11/12 px-8 py-10 z-2">
                <div className="flex items-center justify-center ">
                    <div className="flex flex-col items-start justify-start md:max-w-md w-full md:min-w-[400px] pb-14">
                        <Link href="/" className="mb-6">
                            <LinkButton icon="chevron-left" iconLeft={true}>
                                Voltar para o início
                            </LinkButton>
                        </Link>
                        <HeroTitle as="h1" subtitle="Crie sua conta para começar a usar o UBS Watchdog e monitorar suas transações financeiras.">Cadastro</HeroTitle>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="md:max-w-md w-full md:min-w-[400px]">
                        {responseStatus === "waitingSubmission" && !loading && (
                            <div>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                                            Nome completo
                                        </label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            placeholder="Seu nome completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            validationRule={validateEmail}
                                            errorMessage="Email inválido"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password" className="text-sm font-medium text-foreground">
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
                                            validationRule={password => password.length >= 8 ? true : "A senha deve ter pelo menos 8 caracteres"}
                                            errorMessage="A senha deve ter pelo menos 8 caracteres"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                            Confirmar senha
                                        </label>
                                        <Input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            required
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            validationRule={confirmPassword => confirmPassword == password ? true : "As senhas não coincidem"}
                                            errorMessage="As senhas não coincidem"
                                        />
                                    </div>

                                    <Button type="submit" disabled={!isValid} className="w-full mt-2">
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
                        )}
                        {responseStatus === "waitingSubmission" && loading && (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner className="size-6" />
                                <p className="text-sm text-muted-foreground">Aguarde enquanto criamos sua conta...</p>
                            </div>
                        )}
                        {responseStatus === "success" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-foreground">Cadastro realizado com sucesso!</h3>
                                <p className="text-sm text-muted-foreground">Agora, antes de continuar, por favor, verifique seu email para ativar sua conta.</p>
                                <Link href="/authentication/login">
                                    <Button variant="default" className="w-full mt-2">
                                        Voltar para o login
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {responseStatus === "error" && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[20px] font-regular text-foreground">Erro ao cadastrar!</h3>
                                <p className="text-sm text-muted-foreground">Por favor, tente novamente ou contate o suporte.</p>
                                <Link href="/authentication/registration">
                                    <Button variant="default" className="w-full mt-2">
                                        Voltar para o cadastro
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

