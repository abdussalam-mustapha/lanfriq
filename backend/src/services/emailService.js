import nodemailer from 'nodemailer';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: false,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      logger.info('Email service initialized');
    } catch (error) {
      logger.error(`Failed to initialize email service: ${error.message}`);
    }
  }

  async sendEmail(to, subject, html, text) {
    try {
      if (!this.transporter) {
        logger.warn('Email service not configured. Email not sent.');
        return null;
      }

      const mailOptions = {
        from: config.email.from,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }

  // Send property submission confirmation
  async sendPropertySubmissionEmail(user, property) {
    const subject = 'Property Submitted for Verification';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5f2d;">Property Submitted Successfully</h2>
        <p>Hello ${user.username || user.walletAddress},</p>
        <p>Your property <strong>"${property.title}"</strong> has been successfully submitted for verification.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Property Details:</h3>
          <p><strong>Location:</strong> ${property.location.address}, ${property.location.city}</p>
          <p><strong>Valuation:</strong> $${property.valuation.amount.toLocaleString()}</p>
          <p><strong>Status:</strong> Pending Verification</p>
        </div>
        <p>Our team will review your submission and get back to you within 3-5 business days.</p>
        <p>Best regards,<br>The Lanfriq Team</p>
      </div>
    `;

    if (user.email) {
      await this.sendEmail(user.email, subject, html);
    }
  }

  // Send verification status update
  async sendVerificationStatusEmail(user, property, status, notes) {
    const statusMessages = {
      approved: 'Approved',
      rejected: 'Rejected',
      'requires-update': 'Requires Updates',
    };

    const subject = `Property Verification ${statusMessages[status]}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${status === 'approved' ? '#2c5f2d' : '#d32f2f'};">
          Property Verification ${statusMessages[status]}
        </h2>
        <p>Hello ${user.username || user.walletAddress},</p>
        <p>Your property <strong>"${property.title}"</strong> has been ${statusMessages[status].toLowerCase()}.</p>
        ${notes ? `<div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Reviewer Notes:</h3>
          <p>${notes}</p>
        </div>` : ''}
        ${status === 'approved' ? '<p>You can now proceed with tokenization and listing your property on the marketplace.</p>' : ''}
        <p>Best regards,<br>The Lanfriq Team</p>
      </div>
    `;

    if (user.email) {
      await this.sendEmail(user.email, subject, html);
    }
  }

  // Send share purchase confirmation
  async sendPurchaseConfirmationEmail(buyer, listing, shares, amount) {
    const subject = 'Share Purchase Confirmation';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5f2d;">Purchase Successful!</h2>
        <p>Hello ${buyer.username || buyer.walletAddress},</p>
        <p>Your purchase has been confirmed.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Purchase Details:</h3>
          <p><strong>Property:</strong> ${listing.property.title}</p>
          <p><strong>Shares Purchased:</strong> ${shares}</p>
          <p><strong>Amount Paid:</strong> ${amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>You can view your holdings in your dashboard.</p>
        <p>Best regards,<br>The Lanfriq Team</p>
      </div>
    `;

    if (buyer.email) {
      await this.sendEmail(buyer.email, subject, html);
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Lanfriq';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5f2d;">Welcome to Lanfriq!</h2>
        <p>Hello ${user.username || user.walletAddress},</p>
        <p>Welcome to the future of real estate investment. We're excited to have you on board!</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Getting Started:</h3>
          <ul>
            <li>Browse available property listings</li>
            <li>Submit your own property for tokenization</li>
            <li>Purchase fractional shares of real estate</li>
            <li>Track your portfolio in real-time</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Lanfriq Team</p>
      </div>
    `;

    if (user.email) {
      await this.sendEmail(user.email, subject, html);
    }
  }
}

const emailService = new EmailService();

export default emailService;
