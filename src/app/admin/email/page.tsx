import { getEmailConfigStatus, getEmailMessages } from '@/actions/email';
import EmailModuleClient from '@/components/admin/EmailModuleClient';
import type { ConfigStatus, EmailMessage } from '@/components/admin/EmailModuleClient';
import { AlertCircle } from 'lucide-react';

export default async function AdminEmailPage() {
    let config: ConfigStatus | undefined;
    let inbox: EmailMessage[] = [];
    let sent: EmailMessage[] = [];
    let setupError = '';

    try {
        const [configResult, inboxResult, sentResult] = await Promise.all([
            getEmailConfigStatus(),
            getEmailMessages('INBOX'),
            getEmailMessages('Sent'),
        ]);

        if (!configResult.success || !configResult.data) {
            setupError = 'Email configuration could not be loaded.';
        } else {
            config = configResult.data;
            inbox = inboxResult.data || [];
            sent = sentResult.data || [];
        }
    } catch (error) {
        setupError = error instanceof Error ? error.message : 'Unknown server error';
    }

    if (!config || setupError) {
        return <EmailSetupError message={setupError || 'Email configuration could not be loaded.'} />;
    }

    return (
        <EmailModuleClient
            config={config}
            inbox={inbox}
            sent={sent}
        />
    );
}

function EmailSetupError({ message }: { message: string }) {
    return (
        <div className="min-h-[70vh] bg-[#f4f6f8] p-6">
            <div className="mx-auto max-w-2xl rounded-[4px] border border-amber-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-amber-50 text-amber-700">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-[#1f2937]">Email module needs setup</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
                        <div className="mt-4 rounded-[4px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            <p className="font-semibold text-slate-800">Check these items:</p>
                            <p>1. Run <code className="rounded bg-white px-1 font-mono">npm run migrate</code> in the Coolify application terminal.</p>
                            <p>2. Add Zoho SMTP/IMAP env variables in Coolify.</p>
                            <p>3. Redeploy/restart the app after changing env variables.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
