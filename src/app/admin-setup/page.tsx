
import AdminSetupForm from "@/components/auth/AdminSetupForm";

export const metadata = {
    title: "Admin Setup | Bold Ideas Innovation",
    robots: "noindex, nofollow"
};

export default function AdminSetupPage() {
    return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#FFB81C 1px, transparent 1px), linear-gradient(90deg, #FFB81C 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <div className="relative z-10 w-full">
                <AdminSetupForm />
            </div>
        </div>
    );
}
