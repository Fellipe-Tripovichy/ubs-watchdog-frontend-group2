"use client"
import { useState } from "react";
import { IconButton } from "@/components/ui/iconButton";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/linkButton";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Link from "next/link";

const navigationItems = [
    {
        label: "Transações",
        href: "/transactions",
    },
    {
        label: "Conformidade",
        href: "/complience",
    },
    {
        label: "Relatórios",
        href: "/reports",
    },
]

export function NavigationBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="w-full mx-auto border-b border-muted sticky top-0 z-50 bg-background">
            <div className="flex items-center justify-between w-full px-8 py-6 max-w-[1554px] mx-auto">
                <Link className="flex items-center gap-4" href="/">
                    <img src="/UBS_logo.png" alt="logo" className="w-auto h-8" />
                    <p className="text-muted-foreground text-sm">Brasil</p>
                </Link>
                <div>
                    <div className="flex items-center gap-4 block lg:hidden">
                        <IconButton
                            icon="menu"
                            variant="secondary"
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="block lg:hidden"
                        />
                        <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerContent className="block lg:hidden">
                                <DrawerHeader className="hidden">
                                    <DrawerTitle>Menu</DrawerTitle>
                                </DrawerHeader>
                                <div className="divide-muted divide-y pt-28 px-10 pb-5 flex flex-col gap-4 justify-start">
                                    <div className="flex flex-col items-start gap-4 pb-4">
                                        {navigationItems.map((item) => (
                                            <Link href={item.href} key={item.label}>
                                                <LinkButton className="w-min">
                                                    {item.label}
                                                </LinkButton>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-start gap-4">
                                        <Link href="/authentication/login">
                                            <LinkButton className="w-min" icon="log-in" iconLeft={true}>
                                                Faça seu login
                                            </LinkButton>
                                        </Link>
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <Link href="/authentication/login">
                        <Button variant="default" size="small" showArrow={false} className="hidden lg:block">
                            Faça seu login
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="hidden lg:block max-w-[1554px] mx-auto">
                <div className="flex items-center justify-start w-full px-8 max-w-[1554px] gap-10">
                    {navigationItems.map((item) => (
                        <Link href={item.href} key={item.label}>
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