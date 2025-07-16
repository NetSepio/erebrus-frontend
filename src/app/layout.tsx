import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ErebrusNavbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import { AppKit } from "@/context/appkit";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import DarkFooter from "@/components/ui/footer";
import AppWalletProvider from "@/components/AppWalletProvider";
import { AuthProvider } from "../context/AuthContext";
import CustomWagmiProvider from "@/components/WagmiProvider";

export const metadata = {
  name: "Erebrus",
  description:
    "Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.",
  url: "https://erebrus.io",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  openGraph: {
    type: "website",
    url: "https://erebrus.io",
    title: "Erebrus",
    description:
      "Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.",
  },
  alternates: {
    canonical: "https://erebrus.io",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen flex flex-col", inter.className)}>
        <AppKit>
          <AuthProvider>
            {/* <CustomAptosProvider> */}

            <CustomWagmiProvider>
              <AppWalletProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                >
                  <div className="flex flex-col min-h-screen">
                    <ErebrusNavbar />
                    <main className="flex-grow">{children}</main>
                    <DarkFooter />
                  </div>
                </ThemeProvider>
              </AppWalletProvider>
            </CustomWagmiProvider>
            {/* </CustomAptosProvider> */}
          </AuthProvider>
        </AppKit>
      </body>
    </html>
  );
}
