import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavigationBar } from "@/components/ui/navigationBar";

const frutiger = localFont({
  src: [
    {
      path: "../../public/fonts/Frutiger.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Frutiger_bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-frutiger",
});

export const metadata: Metadata = {
  title: "UBS Watchdog",
  description: "UBS Watchdog Frontend Application",
  icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${frutiger.variable} antialiased bg-background`}
        suppressHydrationWarning
      >
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
