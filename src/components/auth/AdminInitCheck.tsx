
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { checkAdminStatus } from '@/actions/auth';

export default function AdminInitCheck() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const shouldCheckAdminSetup =
            pathname?.startsWith('/admin') && !pathname.startsWith('/admin-setup');

        if (!shouldCheckAdminSetup) return;

        const check = async () => {
            try {
                const data = await checkAdminStatus();
                
                if (!data.adminExists) {
                    router.push('/admin-setup');
                }
            } catch (error) {
                console.error("Failed to check admin status", error);
            }
        };

        check();
    }, [pathname, router]);

    return null;
}
