import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";
import { emailTemplates } from "../utils/emailTemplates.js";

// Configure email transporter (using Ethereal for development, should use real service in production)
let transporter;

const initializeTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else if (process.env.EMAIL_SERVICE === "sendgrid") {
    transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Development: use Ethereal (test email service)
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_EMAIL || "test@ethereal.email",
        pass: process.env.ETHEREAL_PASSWORD || "testpass",
      },
    });
  }
};

export const sendEmail = async (options) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@employeemanagement.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent to ${options.to}:`, info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send failed for ${options.to}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const sendNotificationEmail = async (user, templateName, data) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(...data);
    const result = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Log in database
    const notification = new Notification({
      recipientId: user._id,
      subject: emailContent.subject,
      message: emailContent.html,
      type: templateName,
      isEmailSent: result.success,
      emailError: result.error || null,
    });

    await notification.save();
    return result;
  } catch (error) {
    console.error("Error sending notification email:", error);
    return { success: false, error: error.message };
  }
};

export const createNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      recipientId: userId,
      subject: notificationData.subject,
      message: notificationData.message,
      type: notificationData.type,
      relatedResource: notificationData.relatedResource || null,
      isRead: false,
      isEmailSent: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const getUserNotifications = async (userId, limit = 20, page = 1) => {
  try {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipientId: userId })
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments({ recipientId: userId });

    return {
      notifications,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
};

// Initialize transporter on import
initializeTransporter();
