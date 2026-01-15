
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mesh-gradient min-h-screen flex flex-col">
        <Header />
        <main className="transition-opacity duration-500 flex-grow">
            {children}
        </main>
        <Footer />
        <ChatWidget />
    </div>
  );
}
