import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import AdminInitCheck from "@/components/auth/AdminInitCheck";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bold Ideas Innovation | AI Digital Marketing & Automation Agency",
  description: "AI Digital Marketing & Automation Agency based in Lagos, Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} antialiased text-slate-800`}
      >
        <div className="relative mesh-gradient min-h-screen flex flex-col">
          <Header />
            <main className="transition-opacity duration-500 flex-grow">
              {children}
            </main>
          <Footer />
          <ChatWidget />
          <AdminInitCheck />
        </div>
      </body>
    </html>
  );
}
