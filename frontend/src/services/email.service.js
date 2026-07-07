/**
 * Email Service (Mock/Stub for now)
 * Simulates sending SMTP emails to users upon report submission
 */

export const EmailService = {
  /**
   * Send Confirmation Email
   */
  sendConfirmation: async (email, reportDetails) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Mock Email sent to ${email} with Tracking ID: ${reportDetails.trackingId}`);
    return { success: true };
  }
};
