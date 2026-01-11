"use client"

import { usePathname } from "next/navigation";
import { NavigationBar } from "@/components/ui/navigationBar";
import { Footer } from "@/components/ui/footer";
import { AuthInitializer } from "@/components/authentication/authInitializer";

export function LayoutWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAuthenticationPage = pathname.includes("/authentication");

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <AuthInitializer />
      {!isAuthenticationPage && <NavigationBar />}
      {children}
      {!isAuthenticationPage && <Footer />}
    </div>
  );
}

