import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/context/query-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = Space_Grotesk({ subsets: ["latin"], variable: "--dm-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orkestr",
  description:
    "Orkestr is an AI-native workflow system that designs, executes, and optimizes processes using agents, memory, and real-world integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "h-full",
        dmSans.variable,
        geistMono.variable,
        "antialiased"
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            {children}
          </ThemeProvider>

          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
