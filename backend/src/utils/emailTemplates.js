// Email templates for different notification types

export const emailTemplates = {
  leaveApprovalRequest: (user, leave, approver) => ({
    subject: "Leave Request Awaiting Approval",
    html: `
      <h2>Leave Approval Request</h2>
      <p>Hello ${approver.firstName},</p>
      <p>${user.firstName} ${user.lastName} has submitted a leave request requiring your approval.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Employee:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
      </div>
      
      <p>Please log in to the system to review and approve/reject this request.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  leaveApproved: (user, leave) => ({
    subject: "Your Leave Request Has Been Approved",
    html: `
      <h2>Leave Approved</h2>
      <p>Hello ${user.firstName},</p>
      <p>Good news! Your leave request has been approved.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>Period:</strong> ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(
      leave.endDate
    ).toLocaleDateString()}</p>
        <p><strong>Days:</strong> ${leave.totalDays} day(s)</p>
      </div>
      
      <p>Have a great time!</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  leaveRejected: (user, leave, reason) => ({
    subject: "Your Leave Request Has Been Rejected",
    html: `
      <h2>Leave Request Rejected</h2>
      <p>Hello ${user.firstName},</p>
      <p>We regret to inform you that your leave request has been rejected.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>Period:</strong> ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(
      leave.endDate
    ).toLocaleDateString()}</p>
        <p><strong>Reason for Rejection:</strong> ${reason || "Not specified"}</p>
      </div>
      
      <p>Please contact your manager if you have any questions.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  payrollGenerated: (user, payroll) => ({
    subject: "Your Payroll Has Been Generated",
    html: `
      <h2>Payroll Generated</h2>
      <p>Hello ${user.firstName},</p>
      <p>Your payroll for ${new Date(payroll.month).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })} has been generated and processed.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Basic Salary:</strong> $${payroll.basicSalary}</p>
        <p><strong>Allowances:</strong> $${payroll.allowances}</p>
        <p><strong>Deductions:</strong> $${payroll.deductions}</p>
        <p><strong>Net Salary:</strong> $${payroll.netSalary}</p>
      </div>
      
      <p>Log in to view your detailed payslip.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  attendanceAlert: (user, date, status) => ({
    subject: "Attendance Alert",
    html: `
      <h2>Attendance Alert</h2>
      <p>Hello ${user.firstName},</p>
      <p>Your attendance has been marked as <strong>${status}</strong> on ${new Date(
        date
      ).toLocaleDateString()}.</p>
      
      <p>If this is incorrect, please contact your manager or HR department immediately.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  employeeWelcome: (user) => ({
    subject: "Welcome to Employee Management System",
    html: `
      <h2>Welcome ${user.firstName}!</h2>
      <p>Your account has been created in the Employee Management System.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Employee ID:</strong> ${user.employeeId || "Not assigned"}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Department:</strong> ${user.department || "Not assigned"}</p>
      </div>
      
      <p>You can now log in to the system using your email address and the password provided.</p>
      <p>If you have any questions, please contact the HR department.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  passwordReset: (user, resetLink) => ({
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>Hello ${user.firstName},</p>
      <p>We received a request to reset your password. Click the link below to reset it.</p>
      
      <p style="margin: 20px 0;">
        <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),

  systemAlert: (user, message) => ({
    subject: "System Alert",
    html: `
      <h2>System Alert</h2>
      <p>Hello ${user.firstName},</p>
      <p>${message}</p>
      
      <p>Please log in to the system for more information.</p>
      <p>Best regards,<br/>Employee Management System</p>
    `,
  }),
};
