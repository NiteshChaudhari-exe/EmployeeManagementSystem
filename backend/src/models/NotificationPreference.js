import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    inAppNotifications: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ["immediate", "daily", "weekly"],
      default: "immediate",
    },
    notificationTypes: {
      approvalRequest: { type: Boolean, default: true },
      approvalApproved: { type: Boolean, default: true },
      approvalRejected: { type: Boolean, default: true },
      attendanceAlert: { type: Boolean, default: true },
      payrollGenerated: { type: Boolean, default: true },
      leaveUpdate: { type: Boolean, default: true },
      systemAlert: { type: Boolean, default: true },
      general: { type: Boolean, default: true },
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      startTime: String, // HH:MM format
      endTime: String, // HH:MM format
    },
  },
  {
    timestamps: true,
  }
);

const NotificationPreference = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);

export default NotificationPreference;
