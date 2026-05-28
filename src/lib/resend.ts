import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(
      "SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are not fully configured. Emails will not be sent."
    );
    // Return a mock transporter that logs instead of sending
    transporter = {
      sendMail: async (mailOptions: nodemailer.SendMailOptions) => {
        console.warn("[MOCK SMTP] Email not sent — SMTP not configured.", {
          to: mailOptions.to,
          subject: mailOptions.subject,
        });
        return { messageId: "mock-id" };
      },
    } as nodemailer.Transporter;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
}

/**
 * Email client with a `.emails.send()` interface matching the previously-used Resend API
 * so that all existing call sites continue to work unchanged.
 */
export const resend = {
  emails: {
    send: async ({
      from,
      to,
      subject,
      html,
    }: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
    }) => {
      try {
        const info = await getTransporter().sendMail({
          from,
          to: Array.isArray(to) ? to.join(", ") : to,
          subject,
          html,
        });
        return { data: { id: info.messageId }, error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown SMTP error";
        console.error("[SMTP] Failed to send email:", message);
        return { data: null, error: { message } };
      }
    },
  },
};
