import type { Metadata } from "next";
import { Inter, Geist_Mono, Caveat, Satisfy, Kalam } from "next/font/google";
import "./globals.css";
import "@/styles/document.css";
import { Providers } from "@/components/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import GoogleAnalytics from "@/components/google-analytics";
import SentryInit from "@/components/sentry-init";

// Modern SaaS typography - Inter for clean, professional feel
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cursive fonts for signature pad (keep for signature functionality)
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "ContractVault – Instant AI-generated legal documents",
  description: "Instant, lawyer-grade legal documents from your answers. Create contracts, agreements, and essential legal documents in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} ${caveat.variable} ${satisfy.variable} ${kalam.variable} antialiased`}
        suppressHydrationWarning
      >
        <SentryInit />
        <GoogleAnalytics />
        <Providers>
          <ErrorBoundary>
            <Header />
            <main>{children}</main>
            <Footer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
