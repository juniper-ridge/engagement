import nodemailer from "nodemailer";

export const isEmailConfigured = !!(  
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.CLIENT_EMAIL
);

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  if (!isEmailConfigured) {
    throw new Error("SMTP is not configured.");
  }
  const clientEmail = process.env.CLIENT_EMAIL!;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Juniper Ridge Landscape";
  const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "juniperridgelandscape.com";

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: clientEmail,
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a27; border-bottom: 2px solid #2d5a27; padding-bottom: 8px;">
          New Inquiry — ${siteName}
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px 0;">${data.name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0;">${data.phone || "Not provided"}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 10px; white-space: pre-wrap;">${data.message}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          This email was sent from the contact form at ${domain}
        </p>
      </div>
    `,
  });
}
