import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOTMUDRA | Profit Calculator",
  description: "Simulate investment projections for different trading strategies using historical data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} font-inter antialiased bg-darkBg text-textPrimary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-0 left-0 right-0 bg-darkBg/80 backdrop-blur-md z-50 border-b border-emerald/10">
            <div className="container mx-auto py-4 px-6 flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-2xl font-montserrat text-mint tracking-wide bg-gradient-to-r from-mint via-emerald to-sage bg-clip-text text-transparent">BOTMUDRA</span>
              </Link>
            </div>
          </div>
          <div className="pt-20">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
