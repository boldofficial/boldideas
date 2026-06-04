import { getEmailConfigStatus, getEmailMessages } from '@/actions/email';
import EmailModuleClient from '@/components/admin/EmailModuleClient';

export default async function AdminEmailPage() {
    const [configResult, inboxResult, sentResult] = await Promise.all([
        getEmailConfigStatus(),
        getEmailMessages('INBOX'),
        getEmailMessages('Sent'),
    ]);

    return (
        <EmailModuleClient
            config={configResult.data!}
            inbox={inboxResult.data || []}
            sent={sentResult.data || []}
        />
    );
}
