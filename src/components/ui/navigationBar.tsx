"use client"
import { useState } from "react";
import { IconButton } from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/linkButton";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Link from "next/link";
import { logout, selectIsAuthenticated, selectLoading, selectUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

const navigationItems = [
    {
        label: "Transações",
        href: "/transactions",
    },
    {
        label: "Compliance",
        href: "/compliance",
    },
    {
        label: "Relatórios",
        href: "/reports",
    },
]

export function NavigationBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const loading = useAppSelector(selectLoading);

    async function handleLogout(): Promise<void> {
        await dispatch(logout());
        router.refresh();
    }

    const user = useAppSelector(selectUser);

    return (
        <div data-testid="navigation-bar" className="w-full mx-auto border-b border-muted sticky top-0 z-50 bg-background">
            <div className="flex items-center justify-between w-full px-4 md:px-8 py-6 max-w-[1554px] mx-auto">
                <Link className="flex items-center gap-4" href="/">
                    <img src="/UBS_Logo.png" alt="UBS Logo" className="w-auto h-8" />
                    <p className="text-muted-foreground text-caption">Brasil</p>
                </Link>
                <div>
                    <div className="flex items-center gap-4 block lg:hidden">
                        <IconButton
                            icon={isDrawerOpen ? "x" : "menu"}
                            variant="secondary"
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="block lg:hidden"
                        />
                        <Drawer dismissible direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerContent className="block lg:hidden">
                                <DrawerHeader className="hidden">
                                    <DrawerTitle>Menu</DrawerTitle>
                                    <DrawerDescription>Menu de navegação principal</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex justify-end align-start w-full h-28" >
                                    <button
                                        type="button"
                                        className="w-16 h-16 mr-6 cursor-pointer bg-transparent border-0 p-0"
                                        onClick={() => setIsDrawerOpen(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setIsDrawerOpen(false);
                                            }
                                        }}
                                        aria-label="Fechar menu"
                                    />
                                </div>
                                <div className="divide-muted divide-y px-4 md:px-10 pb-5 flex flex-col gap-4 justify-start">
                                    <div className="flex flex-col items-start gap-4 pb-4">
                                        {isAuthenticated &&
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    <p className="font-bold text-muted-foreground">{user?.displayName?.charAt(0)}</p>
                                                </div>
                                                <div className="flex flex-col items-start justify-center">
                                                    <p className="text-foreground text-caption font-bold">{user?.displayName}</p>
                                                    <p className="text-muted-foreground text-caption">{user?.email}</p>
                                                </div>
                                            </div>
                                        }
                                        {navigationItems.map((item) => (
                                            <Link href={isAuthenticated ? item.href : "/authentication/login"} key={item.label} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                                                <LinkButton className="w-min">
                                                    {item.label}
                                                </LinkButton>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-start gap-4">
                                        {isAuthenticated ? (
                                            <div>
                                                <LinkButton className="w-min" icon="log-out" iconLeft={true} onClick={handleLogout}>
                                                    Faça seu logout
                                                </LinkButton>
                                            </div>
                                        ) : (
                                            <Link href="/authentication/login">
                                                <LinkButton className="w-min" icon="log-in" iconLeft={true}>
                                                    Faça seu login
                                                </LinkButton>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                    {isAuthenticated ? (
                        <div className="hidden lg:block">
                            <Popover open={isOpen} onOpenChange={setIsOpen}>
                                <PopoverTrigger asChild>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <p className="font-bold text-muted-foreground">{user?.displayName?.charAt(0)}</p>
                                        </div>
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-foreground text-caption font-bold">{user?.displayName}</p>
                                            <p className="text-muted-foreground text-caption">{user?.email}</p>
                                        </div>
                                        <IconButton icon={isOpen ? "chevron-up" : "chevron-down"} variant="secondary" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Button variant="default" size="small" showArrow={false} className="hidden lg:block" onClick={handleLogout}>
                                        Faça seu logout
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) : (
                        <Link href="/authentication/login">
                            <Button variant="default" size="small" showArrow={false} className="hidden lg:block">
                                {loading ? <div className="flex items-center gap-2"><Spinner className="text-primary-foreground" /> Buscando usuário...</div> : "Faça seu login"}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="hidden lg:block max-w-[1554px] mx-auto">
                <div className="flex items-center justify-start w-full px-8 max-w-[1554px] gap-10">
                    {navigationItems.map((item) => (
                        <Link href={isAuthenticated ? item.href : "/authentication/login"} key={item.label}>
                            <LinkButton>
                                {item.label}
                            </LinkButton>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}