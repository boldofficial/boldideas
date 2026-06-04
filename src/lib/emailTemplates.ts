export type EmailTemplate = {
    id: string;
    label: string;
    subject: string;
    body: string;
};

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'first_follow_up',
        label: 'First follow-up',
        subject: 'Following up with {{leadName}}',
        body: `Hi {{leadName}},

Thank you for reaching out to Bold Ideas. I wanted to follow up and learn a little more about what you are trying to build.

Could you share your preferred timeline, key goals, and any must-have features?

Best regards,
Bold Ideas`,
    },
    {
        id: 'quote_follow_up',
        label: 'Quote follow-up',
        subject: 'Following up on your quote request',
        body: `Hi {{leadName}},

I am following up on your quote request for {{serviceInterest}}.

If the scope still looks right, we can schedule a quick call to confirm the details and move the quote forward.

Best regards,
Bold Ideas`,
    },
    {
        id: 'callback_request',
        label: 'Request callback',
        subject: 'Quick call about your project',
        body: `Hi {{leadName}},

We can help clarify the best option for your project with a quick callback.

Please send your preferred day/time and the best number to reach you on.

Best regards,
Bold Ideas`,
    },
    {
        id: 'proposal_sent',
        label: 'Proposal sent',
        subject: 'Proposal for {{serviceInterest}}',
        body: `Hi {{leadName}},

I have prepared the next step for {{serviceInterest}}.

Please review the details and let me know if you would like us to adjust the scope, timeline, or payment structure.

Best regards,
Bold Ideas`,
    },
    {
        id: 'payment_reminder',
        label: 'Payment reminder',
        subject: 'Payment reminder from Bold Ideas',
        body: `Hi {{leadName}},

This is a quick reminder about the pending payment for your project.

Please let us know once payment has been completed, or reply here if you need the invoice resent.

Best regards,
Bold Ideas`,
    },
    {
        id: 'project_kickoff',
        label: 'Project kickoff',
        subject: 'Getting started with your project',
        body: `Hi {{leadName}},

We are ready to begin the project setup.

Please send any brand files, content, access details, and references that will help us start cleanly.

Best regards,
Bold Ideas`,
    },
];

export function applyEmailTemplate(template: EmailTemplate, values: Record<string, string | null | undefined>) {
    const replaceTokens = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] || '');
    return {
        subject: replaceTokens(template.subject).replace(/\s+/g, ' ').trim(),
        body: replaceTokens(template.body).trim(),
    };
}
