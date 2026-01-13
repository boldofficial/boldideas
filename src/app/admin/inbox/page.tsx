
import { getMessages } from "@/actions/contact";
import MessageInbox from "@/components/admin/MessageInbox";

export default async function AdminInboxPage() {
  const { data: messages } = await getMessages();

  return (
    <div className="space-y-6">
      <MessageInbox initialMessages={messages || []} />
    </div>
  );
}
