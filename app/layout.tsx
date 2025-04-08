import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ["latin"] });

// Create a client
const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Personal AI V1",
  description: "Personal AI Interaction Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
} 