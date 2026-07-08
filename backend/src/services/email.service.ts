import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface ReportDetails {
  reportId: string;
  issueCategory: string;
  priority: string;
  wardNumber: string;
  description: string;
  aiResolutionPlan: any;
  assignedOfficer: any;
  citizenName: string;
}

export const sendResolutionEmail = async (
  toEmail: string,
  reportDetails: ReportDetails,
  attachments: Attachment[]
) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.error('SMTP credentials are not configured in .env. Email not sent.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Construct checklist HTML
  let checklistHtml = '';
  if (reportDetails.aiResolutionPlan && reportDetails.aiResolutionPlan.checklist) {
    checklistHtml = `
      <h3>Completed Action Items:</h3>
      <ul>
        ${reportDetails.aiResolutionPlan.checklist
          .map((item: any) => `<li>✅ ${item.task} (Completed by ${item.assignedTo})</li>`)
          .join('')}
      </ul>
    `;
  }

  // Construct officer details HTML
  let officerHtml = '';
  if (reportDetails.assignedOfficer) {
    officerHtml = `
      <p><strong>Assigned Officer:</strong> ${reportDetails.assignedOfficer.name}</p>
      <p><strong>Officer Phone:</strong> ${reportDetails.assignedOfficer.phone}</p>
    `;
  }

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #15803d; text-align: center;">AERION Final Resolution Report</h2>
      <p>Dear ${reportDetails.citizenName},</p>
      <p>We are pleased to inform you that your reported issue (<strong>Ticket #${reportDetails.reportId}</strong>) has been fully resolved by the municipal field team.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Report Details:</h3>
        <p><strong>Category:</strong> ${reportDetails.issueCategory}</p>
        <p><strong>Priority:</strong> ${reportDetails.priority}</p>
        <p><strong>Location:</strong> ${reportDetails.wardNumber}</p>
        <p><strong>Your Description:</strong> ${reportDetails.description}</p>
        ${officerHtml}
      </div>

      ${checklistHtml}
      
      <p>Please find the official closure evidence (images and/or documents) attached to this email.</p>
      <br />
      <p>Thank you for contributing to a cleaner, safer environment.</p>
      <p><strong>AERION Municipal Intelligence Team</strong></p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"AERION Environment Portal" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Resolution Completed: Ticket ${reportDetails.reportId}`,
      html: htmlBody,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      })),
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Failed to send resolution email:', error);
    throw error;
  }
};
