import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather Intelligence Dashboard",
  description: "Real-time weather monitoring and energy demand forecasting",
  keywords: ["weather", "dashboard", "energy", "forecast", "monitoring"],
  authors: [{ name: "Weather Intelligence Team" }],
  openGraph: {
    title: "Weather Intelligence Dashboard",
    description: "Real-time weather monitoring and energy demand forecasting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Intelligence Dashboard",
    description: "Real-time weather monitoring and energy demand forecasting",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
