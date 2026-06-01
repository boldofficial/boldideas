import type { Metadata } from "next";
import "./globals.css";
import AdminInitCheck from "@/components/auth/AdminInitCheck";

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
      <body className="antialiased text-slate-800">
        {children}
        <AdminInitCheck />
      </body>
    </html>
  );
}
