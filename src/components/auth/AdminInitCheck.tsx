
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { checkAdminStatus } from '@/actions/auth';

export default function AdminInitCheck() {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const isAuthPage = pathname?.startsWith('/admin-setup') || pathname?.startsWith('/auth/');
        
        if (checked || isAuthPage) return;

        const check = async () => {
            try {
                const data = await checkAdminStatus();
                
                if (!data.adminExists && !pathname?.startsWith('/admin-setup')) {
                    router.push('/admin-setup');
                }
            } catch (error) {
                console.error("Failed to check admin status", error);
            } finally {
                setChecked(true);
            }
        };

        check();
    }, [pathname, checked, router]);

    return null;
}
