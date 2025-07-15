import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ErebrusNavbar from "@/components/navbar";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import DarkFooter from "@/components/ui/footer";
import ContextProvider from '../context2'
import { headers } from 'next/headers'

const headersObj = await headers();
const cookies = headersObj.get('cookie')



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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {




  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen flex flex-col", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <div className="flex flex-col min-h-screen">
            <ErebrusNavbar />
            <ContextProvider cookies={cookies}>{children}</ContextProvider>

            <DarkFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
