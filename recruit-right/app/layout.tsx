import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutDecider from "./LayoutDecider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recruit Right",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Recruit Right</title>
        </head>
        <body className={inter.className}>
          <LayoutDecider>{children}</LayoutDecider>
        </body>
      </html>
    </ClerkProvider>
  );
}
