import Notification from "../models/Notification.js";
import NotificationPreference from "../models/NotificationPreference.js";
import { markNotificationAsRead, getUserNotifications, getUnreadCount, sendEmail } from "../services/emailService.js";

// Get all notifications for user
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipientId: userId })
      .sort("-createdAt")
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Notification.countDocuments({ recipientId: userId });

    res.status(200).json({
      success: true,
      data: notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: id,
      recipientId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipientId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get notification preferences
export const getPreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    let preferences = await NotificationPreference.findOne({ userId });

    if (!preferences) {
      preferences = new NotificationPreference({ userId });
      await preferences.save();
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update notification preferences
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { emailNotifications, inAppNotifications, frequency, notificationTypes, quietHours } = req.body;

    let preferences = await NotificationPreference.findOne({ userId });

    if (!preferences) {
      preferences = new NotificationPreference({ userId });
    }

    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
    if (inAppNotifications !== undefined) preferences.inAppNotifications = inAppNotifications;
    if (frequency) preferences.frequency = frequency;
    if (notificationTypes) preferences.notificationTypes = notificationTypes;
    if (quietHours) preferences.quietHours = quietHours;

    await preferences.save();

    res.status(200).json({
      success: true,
      message: "Preferences updated",
      data: preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send test email
export const sendTestEmail = async (req, res) => {
  try {
    const user = req.user;

    const result = await sendEmail({
      to: user.email,
      subject: "Test Email from Employee Management System",
      html: `
        <h2>Test Email</h2>
        <p>Hello ${user.firstName},</p>
        <p>This is a test email to verify your email notifications are working correctly.</p>
        <p>Best regards,<br/>Employee Management System</p>
      `,
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Test email sent successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
