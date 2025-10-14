// Import Firebase interceptor FIRST to prevent initialization
import "@/lib/firebase-interceptor";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmationProvider } from "@/components/ui/ConfirmationProvider";
import UnifiedAppProvider from "@/context/UnifiedAppContext";
import FirebaseConnectionWrapper from "@/components/FirebaseConnectionWrapper";
import BrowserDiagnostic from "@/components/debug/BrowserDiagnostic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Territorios JW",
  description: "Gestión moderna de territorios para los Testigos de Jehová",
  keywords: [
    "territorios",
    "JW",
    "testigos",
    "jehová",
    "predicación",
    "gestión",
  ],
  authors: [{ name: "Sistema de Territorios" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <FirebaseConnectionWrapper>
          <UnifiedAppProvider>
            <ToastProvider>
              <ConfirmationProvider>
                {children}
                <BrowserDiagnostic />
              </ConfirmationProvider>
            </ToastProvider>
          </UnifiedAppProvider>
        </FirebaseConnectionWrapper>
      </body>
    </html>
  );
}
