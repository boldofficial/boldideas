'use server';

import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { resend } from '@/lib/resend';

export async function submitContactForm(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const content = formData.get('content') as string;

    if (!name || !email || !content) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // 1. Save to Database
        await db.insert(messages).values({
            name,
            email,
            content,
            status: 'new'
        });

        // 2. Send Admin Notification Email (if RESEND_API_KEY is configured)
        // We'll wrap this in a try-catch so DB save succeeds even if email fails
        try {
             await resend.emails.send({
                from: process.env.FROM_EMAIL!, 
                to: process.env.ADMIN_EMAIL!, // Your admin email
                subject: `New Enquiry: ${name}`,
                html: `
                    <h1>New Enquiry</h1>
                    <p><strong>Identity:</strong> ${name}</p>
                    <p><strong>Comms Channel:</strong> ${email}</p>
                    <p><strong>Content:</strong></p>
                    <blockquote style="background: #f4f4f5; padding: 16px; border-left: 4px solid #002D5B;">
                        ${content}
                    </blockquote>
                    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">Access Admin Panel</a></p>
                `
            });
        } catch (emailError) {
            console.error("Failed to send email notif:", emailError);
        }

        // 3. Send Auto-Acknowledgement to Client
        try {
             await resend.emails.send({
                from: process.env.FROM_EMAIL!, 
                to: email, // The client's email
                subject: 'Receipt Confirmed: Bold Ideas',
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Receipt Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 0 40px; text-align: left;">
                             <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #002D5B; letter-spacing: -0.5px; text-transform: uppercase;">
                                Bold Ideas<span style="color: #D4AF37;">.</span>
                             </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155;">
                                Dear ${name},
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                                We have successfully received your email. Our team is currently reviwing your inquiry and will determine the appropriate project for response.
                            </p>
                            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">
                                Expect a response within 24-48 hours.
                            </p>
                            <p style="margin: 32px 0 0 0; font-size: 16px; color: #334155; font-weight: 600;">
                                Best regards,<br/>
                                <span style="color: #002D5B;">The Bold Ideas Team</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                &copy; ${new Date().getFullYear()} Bold Ideas Innovation. All rights reserved.<br/>
                                <a href="https://getboldideas.com" style="color: #002D5B; text-decoration: none; font-weight: 600;">getboldideas.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
                `
            });
        } catch (autoReplyError) {
             console.error("Failed to send auto-reply:", autoReplyError);
        }

        return { success: true };
    } catch (error) {
        console.error("Contact Form Error:", error);
        return { success: false, error: 'Email failed' };
    }
}

export async function getMessages() {
    try {
        const { desc } = await import('drizzle-orm');
        const data = await db.select().from(messages).orderBy(desc(messages.createdAt));
        return { success: true, data };
    } catch (error) {
        console.error("Get Messages Error:", error);
        return { success: false, data: [] };
    }
}

export async function markAsRead(id: string) {
    try {
        const { eq } = await import('drizzle-orm');
        await db.update(messages).set({ status: 'read' }).where(eq(messages.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function sendResponse(id: string, email: string, clientName: string, responseContent: string) {
    // console.log(`[sendResponse] Starting...`);
    console.log(`[sendResponse] To: ${email}, ID: ${id}`);
    console.log(`[sendResponse] API Key Present: ${!!process.env.RESEND_API_KEY}`);
    
    try {
        const { eq } = await import('drizzle-orm');
        
// 1. Send Email
        // console.log(`[sendResponse] Calling Resend API...`);
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL!, 
            to: email,
            subject: 'Response from Bold Ideas',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Response from Bold Ideas</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 0 40px; text-align: left;">
                             <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #002D5B; letter-spacing: -0.5px; text-transform: uppercase;">
                                Bold Ideas<span style="color: #D4AF37;">.</span>
                             </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155;">
                                Dear ${clientName},
                            </p>
                            <div style="font-size: 16px; line-height: 1.6; color: #334155;">
                                ${responseContent.replace(/\n/g, '<br/>')}
                            </div>
                            <p style="margin: 32px 0 0 0; font-size: 16px; color: #334155; font-weight: 600;">
                                Best regards,<br/>
                                <span style="color: #002D5B;">The Bold Ideas Team</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                &copy; ${new Date().getFullYear()} Bold Ideas Innovation. All rights reserved.<br/>
                                <a href="https://getboldideas.com" style="color: #002D5B; text-decoration: none; font-weight: 600;">getboldideas.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        });

        if (error) {
            console.error("[sendResponse] Resend API Error:", error);
            return { success: false, error: 'Resend API returned error: ' + error.message };
        }

        // console.log(`[sendResponse] Email sent successfully. ID: ${data?.id}`);

        // 2. Update Status in DB
        // console.log(`[sendResponse] Updating DB status...`);
        await db.update(messages).set({ status: 'replied' }).where(eq(messages.id, id));

        return { success: true };
    } catch (error: any) {
        console.error("[sendResponse] Catch Error:", error);
        return { success: false, error: 'Failed to send response: ' + error.message };
    }
}

export async function markAsUnread(id: string) {
    try {
        const { eq } = await import('drizzle-orm');
        await db.update(messages).set({ status: 'new' }).where(eq(messages.id, id));
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function deleteMessage(id: string) {
    try {
        const { eq } = await import('drizzle-orm');
        await db.delete(messages).where(eq(messages.id, id));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
