import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";

const footerLinks = [
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
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-accent mt-auto">
            <div className="w-full max-w-[1554px] mx-auto px-8 py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img src="/UBS_Logo.png" alt="UBS Logo" className="w-auto h-8" />
                            <p className="text-muted-foreground text-sm">Brasil</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} UBS. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
        </footer>
    );
}

