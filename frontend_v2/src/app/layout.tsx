import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neurodiverse Support Chat",
  description: "AI-powered support for neurodiverse individuals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Custom font link removed; using next/font/google for Inter font */}
      </head>
      <body className={inter.className}>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
