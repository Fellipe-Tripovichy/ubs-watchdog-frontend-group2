import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";
import { Breadcrumb } from "./breadcrumb";

const footerLinks = [
    {
        label: "Transações",
        href: "/transactions",
    },
    {
        label: "Conformidade",
        href: "/compliance",
    },
    {
        label: "Relatórios",
        href: "/reports",
    },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    function handleScrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <footer className="w-full mt-auto">
            <div className="flex md:flex-row flex-col items-center justify-between w-full px-8 pt-20 pb-10 max-w-[1554px] mx-auto">
                <Breadcrumb />
                <LinkButton icon="chevron-up" onClick={handleScrollToTop}>Voltar ao topo</LinkButton>
            </div>
            <div className="bg-secondary">
                <div className="w-full max-w-[1554px] mx-auto px-8 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <Link className="flex items-center gap-4" href="/">
                                <img src="/UBS_Logo.png" alt="UBS Logo" className="w-auto h-8" />
                                <p className="text-muted-foreground text-sm">Brasil</p>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                © {currentYear} UBS. Todos os direitos reservados.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {footerLinks.map((link, index) => (
                                <div key={link.label} className="flex items-center gap-4">
                                    <Link href={link.href}>
                                        <LinkButton size="small">
                                            {link.label}
                                        </LinkButton>
                                    </Link>
                                    {index < footerLinks.length - 1 && <p className="text-muted-foreground text-sm">|</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

