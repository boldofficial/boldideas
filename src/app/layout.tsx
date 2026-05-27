import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import AdminInitCheck from "@/components/auth/AdminInitCheck";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Bold Ideas Innovation | AI Digital Marketing & Automation Agency",
  description: "AI Digital Marketing & Automation Agency serving Illinois and Wisconsin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} antialiased text-slate-800`}
      >
        {children}
        <AdminInitCheck />
      </body>
    </html>
  );
}
