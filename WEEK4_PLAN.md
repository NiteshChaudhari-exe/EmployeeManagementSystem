# 📋 WEEK 4 IMPLEMENTATION PLAN - Advanced Features & Enhancements

**Date:** February 3, 2026  
**Phase:** 4 of 5  
**Duration:** 20-24 hours  
**Focus:** File Uploads, Email Notifications, Advanced Features  
**Status:** 📋 Planning Phase

---

## 🎯 Week 4 Objectives

By end of Week 4:
1. Implement file upload system (profile photos, documents)
2. Add email notification system (approvals, alerts)
3. Create advanced search and bulk operations
4. Add dark mode toggle
5. Implement audit logging system
6. Create admin dashboard enhancements

---

## 📊 Current Status

### Week 3 Deliverables ✅
- All 8 pages fully functional
- 31 API endpoints working
- Real-time filtering and search
- CSV export on all pages
- Reports page with analytics
- Full backend integration (100% complete)
- Documentation cleaned up

### Week 4 Priority Features
- 🔴 **HIGH** - File uploads (widely needed)
- 🔴 **HIGH** - Email notifications (business critical)
- 🟡 **MEDIUM** - Bulk operations (efficiency)
- 🟡 **MEDIUM** - Dark mode (UX enhancement)
- 🟢 **LOW** - Audit logging (compliance)

---

## 📌 Feature Breakdown

### 1. File Upload System (8-10 hours)

#### Backend Tasks
```
✓ Choose storage option:
  - Local filesystem: For MVP/testing
  - AWS S3: For production
  - Cloudinary: Managed service (easiest)

✓ Implement upload endpoints:
  - POST /api/employees/:id/avatar - Upload profile photo
  - POST /api/documents - Upload documents
  - GET /api/documents/:id - Download document
  - DELETE /api/documents/:id - Delete document

✓ Add file validation:
  - File size limits (5MB for photos, 50MB for docs)
  - File type restrictions (jpg, png for photos; pdf, doc for docs)
  - Virus scanning (optional, production only)

✓ Create file model:
  - fileName, fileType, fileSize, uploadedBy, uploadedAt
  - Associated resource (employee_id, leave_id, etc.)
  - Download URL
```

#### Frontend Tasks
```
✓ Create file upload components:
  - Avatar upload in Employee profile
  - Document upload in Leave requests
  - Drag-and-drop file input

✓ Add upload progress:
  - Progress bar during upload
  - Cancel upload button
  - Upload status messages

✓ Display files:
  - Show uploaded documents as list
  - Display profile images
  - Download/delete buttons
```

#### API Endpoints (6 new)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload/avatar` | Upload employee photo |
| POST | `/api/upload/document` | Upload document |
| GET | `/api/documents/:id` | Download document |
| DELETE | `/api/documents/:id` | Delete document |
| GET | `/api/employees/:id/avatar` | Get profile photo |
| POST | `/api/documents/batch-delete` | Delete multiple documents |

---

### 2. Email Notification System (6-8 hours)

#### Backend Tasks
```
✓ Choose email service:
  - Nodemailer (free, local SMTP)
  - SendGrid (free tier available)
  - AWS SES (pay-per-use)

✓ Create email templates:
  - Approval requests (Leave/Payroll)
  - Approval notifications
  - Department updates
  - Attendance alerts
  - Password reset
  - Welcome emails

✓ Implement notification service:
  - Queue system (Bull/BullMQ) for reliability
  - Retry logic (3 attempts)
  - Error logging

✓ Create notification triggers:
  - When leave approved/rejected
  - When payroll generated
  - When attendance marked absent
  - When department updated
  - On user creation
```

#### Frontend Tasks
```
✓ Notification center (in-app):
  - Toast notifications (real-time)
  - Notification history
  - Mark as read

✓ User preferences:
  - Email notification toggle
  - Frequency selection (immediate, daily digest, weekly)
  - Notification types filter
```

#### API Endpoints (4 new)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/notifications/send-test` | Send test email |
| GET | `/api/notifications/history` | Get notification history |
| PUT | `/api/notifications/preferences` | Update preferences |
| POST | `/api/notifications/mark-read` | Mark notification as read |

---

### 3. Bulk Operations & Advanced Search (4-6 hours)

#### Backend Tasks
```
✓ Implement bulk operations:
  - Bulk import employees (CSV/Excel)
  - Bulk delete employees/leaves
  - Bulk update status (attendance, leaves)
  - Bulk email notifications

✓ Advanced search:
  - Full-text search across multiple fields
  - Date range filters
  - Advanced filters (salary range, experience, etc.)
  - Saved search filters
  - Search history
```

#### Frontend Tasks
```
✓ Bulk import UI:
  - CSV template download
  - File upload with preview
  - Progress bar
  - Error reporting

✓ Advanced filters UI:
  - Filter builder (AND/OR logic)
  - Save favorite filters
  - Filter templates
  - Search suggestions
```

#### API Endpoints (4 new)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/import/employees` | Bulk import employees |
| POST | `/api/export/employees` | Bulk export employees |
| POST | `/api/bulk-update` | Update multiple records |
| POST | `/api/bulk-delete` | Delete multiple records |

---

### 4. Dark Mode & UI Enhancements (3-4 hours)

#### Frontend Tasks
```
✓ Implement dark mode:
  - Toggle button in settings
  - System preference detection
  - LocalStorage persistence
  - Smooth transitions

✓ UI improvements:
  - Enhanced color palette
  - Better contrast ratios
  - Improved spacing
  - Loading skeleton screens
  - Enhanced error pages
```

#### No API changes needed
- Pure frontend feature
- Uses existing settings endpoint

---

### 5. Audit Logging System (4-6 hours)

#### Backend Tasks
```
✓ Create audit log model:
  - User, action, resource, timestamp
  - Old/new values for changes
  - IP address, browser
  - Success/failure status

✓ Implement audit middleware:
  - Log all API modifications (POST, PUT, DELETE)
  - Log login/logout
  - Log failed authentication attempts
  - Log permission denials

✓ Create audit endpoints:
  - GET /api/audit-logs (with filters)
  - GET /api/audit-logs/user/:id
  - GET /api/audit-logs/resource/:type/:id
  - Export audit logs (CSV)
```

#### Frontend Tasks
```
✓ Audit log viewer:
  - Display audit logs in admin dashboard
  - Filters by user, date, action
  - Search capabilities
  - Export functionality
```

---

## 🗂️ File Structure Changes

### New Backend Files
```
backend/src/
├── controllers/
│   ├── uploadController.js (NEW)
│   ├── emailController.js (NEW)
│   ├── auditController.js (NEW)
│   └── bulkController.js (NEW)
├── services/
│   ├── uploadService.js (NEW)
│   ├── emailService.js (NEW)
│   ├── auditService.js (NEW)
│   └── importExportService.js (NEW)
├── models/
│   ├── Document.js (NEW)
│   ├── AuditLog.js (NEW)
│   └── NotificationPreference.js (NEW)
├── middleware/
│   ├── auditMiddleware.js (NEW)
│   └── uploadMiddleware.js (NEW)
├── utils/
│   ├── emailTemplates.js (NEW)
│   └── fileValidator.js (NEW)
└── config/
    └── storage.js (NEW)
```

### New Frontend Files
```
src/app/
├── components/
│   ├── FileUpload.tsx (NEW)
│   ├── AuditLogViewer.tsx (NEW)
│   ├── BulkImportDialog.tsx (NEW)
│   └── AdvancedSearch.tsx (NEW)
├── pages/
│   └── Settings.tsx (ENHANCE with dark mode, notifications)
├── hooks/
│   ├── useFileUpload.ts (NEW)
│   ├── useNotifications.ts (NEW)
│   └── useDarkMode.ts (NEW)
├── services/
│   ├── emailService.ts (NEW)
│   ├── uploadService.ts (NEW)
│   └── bulkImportService.ts (NEW)
└── store/
    ├── notificationSlice.ts (NEW)
    ├── settingsSlice.ts (NEW)
    └── auditSlice.ts (NEW)
```

---

## 📋 Week 4 Task Breakdown

### Task 4.1: Setup File Upload System (8 hours)

**Subtasks:**
1. Choose storage solution (local filesystem for MVP)
2. Create upload middleware with validation
3. Implement upload controller and routes
4. Create Document model
5. Build FileUpload component
6. Add upload to Employee and Leave pages
7. Test all upload flows
8. Handle errors and edge cases

**Deliverable:** Full file upload with progress tracking

**Dependencies:** None (builds on Week 3)

---

### Task 4.2: Implement Email Notifications (8 hours)

**Subtasks:**
1. Setup email service (Nodemailer or SendGrid)
2. Create email templates for all scenarios
3. Implement notification queue system
4. Create email triggers (rules for when to send)
5. Build notification history model
6. Create notification center UI
7. Add notification preferences page
8. Test email sending flow

**Deliverable:** Fully functional email notification system

**Dependencies:** Task 4.1 (for file attachments in emails)

---

### Task 4.3: Add Bulk Operations (4 hours)

**Subtasks:**
1. Create CSV import template
2. Implement bulk import endpoint
3. Add validation for imported data
4. Build import UI component
5. Create bulk delete endpoints
6. Add bulk update functionality
7. Test with sample data
8. Handle errors and partial failures

**Deliverable:** Bulk import/export for all resources

**Dependencies:** Task 4.1

---

### Task 4.4: Dark Mode & UI Polish (4 hours)

**Subtasks:**
1. Create dark mode theme colors
2. Implement theme provider
3. Add toggle button
4. Implement localStorage persistence
5. Test all pages in dark mode
6. Add loading skeletons
7. Enhance error pages
8. Test accessibility

**Deliverable:** Full dark mode support + UI enhancements

**Dependencies:** None (pure frontend)

---

### Task 4.5: Audit Logging System (4 hours)

**Subtasks:**
1. Create AuditLog model
2. Implement audit middleware
3. Create audit endpoints
4. Build audit log viewer UI
5. Add filtering and search
6. Implement export functionality
7. Test audit trail completeness
8. Verify security (admin only)

**Deliverable:** Complete audit trail system

**Dependencies:** None

---

## 🧪 Testing Strategy

### Unit Tests
```
- File upload validation
- Email template rendering
- Bulk import validation
- Dark mode toggle
- Audit log creation
```

### Integration Tests
```
- Upload → Store → Display flow
- Email notification → Queue → Send flow
- Bulk import → Validate → Insert flow
- Settings → Update theme → Apply flow
```

### E2E Tests
```
- User uploads profile photo
- Leave approval triggers email
- Admin imports 100 employees
- Toggle dark mode and verify
- Audit log appears after update
```

---

## 📊 Success Criteria

| Task | Criteria |
|------|----------|
| File Uploads | ✅ Upload works, files stored, displayed correctly |
| Emails | ✅ Emails sent reliably, templates render correctly |
| Bulk Ops | ✅ Import validates, handles errors, shows progress |
| Dark Mode | ✅ Toggle works, persists, all pages supported |
| Audit Logs | ✅ All actions logged, admin can view, export works |

---

## 🚀 Deployment Plan

### Staging Deployment (before production)
1. Deploy to staging environment
2. Run full test suite
3. Manual testing checklist
4. Performance testing
5. Security review

### Production Deployment
1. Database migrations (new collections)
2. Deploy backend changes
3. Deploy frontend changes
4. Run sanity checks
5. Monitor for errors

---

## 📚 Resources & Dependencies

### File Upload
- Multer (Node.js file upload middleware)
- Sharp (image optimization)
- AWS SDK (if using S3)

### Email
- Nodemailer or SendGrid SDK
- Bull/BullMQ (job queue)
- Email-templates library

### UI/UX
- next-themes (dark mode)
- react-dropzone (drag-drop uploads)
- react-hot-toast (notifications)

### Testing
- Jest (unit tests)
- Supertest (API tests)
- Playwright (E2E tests)

---

## ⏰ Timeline

```
Monday:     Tasks 4.1 (File uploads) - 8 hours
Tuesday:    Tasks 4.2 (Email) - 8 hours
Wednesday:  Tasks 4.3 (Bulk ops) & 4.4 (Dark mode) - 8 hours
Thursday:   Task 4.5 (Audit) + Testing - 8 hours
Friday:     Bug fixes, documentation, deployment - 8 hours

Total: 40 hours (across 5 days)
Realistic with interruptions: 24-30 hours
```

---

## 🎯 Stretch Goals (if time permits)

1. **Advanced Analytics Dashboard**
   - Salary trends by department
   - Employee productivity metrics
   - Leave patterns analysis

2. **Mobile Responsive Enhancements**
   - Touch-friendly file upload
   - Mobile-optimized email templates
   - Responsive data tables

3. **Performance Optimization**
   - Image lazy loading
   - Pagination for large datasets
   - Database query optimization

4. **Security Enhancements**
   - Rate limiting on email sends
   - File scan for malware
   - GDPR compliance features

---

## ❓ Questions Before Starting

1. **File Storage:** Should we use local filesystem (MVP) or AWS S3 (production)?
2. **Email Service:** Which email provider to use (Nodemailer, SendGrid, AWS SES)?
3. **Priorities:** Are file uploads or email notifications more urgent?
4. **Users:** How many concurrent users expected? (affects upload system design)
5. **Timeline:** Can we compress this into 3 days instead of 5?

---

## 📝 Notes

- All features should maintain backward compatibility with Week 3
- API versioning might be needed if breaking changes required
- Documentation must be updated as features are added
- Security review critical before deployment
- Performance testing needed for bulk operations

---

**Status:** Ready to begin Week 4 implementation  
**Next Step:** Finalize priorities and assign tasks  
**Target Go-Live:** End of Week 4 ✅
