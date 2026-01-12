
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
    title: "Recover Access | Bold Ideas Innovation",
    robots: "noindex, nofollow"
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
             {/* Grid Background */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <div className="relative z-10 w-full">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
