"use client"

import { usePathname } from "next/navigation";
import { NavigationBar } from "@/components/ui/navigationBar";
import { Footer } from "@/components/ui/footer";
import { AuthInitializer } from "@/components/authInitializer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticationPage = pathname.includes("/authentication");

  return (
    <>
      <AuthInitializer />
      {!isAuthenticationPage && <NavigationBar />}
      {children}
      {!isAuthenticationPage && <Footer />}
    </>
  );
}

