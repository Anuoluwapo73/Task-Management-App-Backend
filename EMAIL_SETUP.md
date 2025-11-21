# 📧 Email Notification Setup Guide

## ✅ What's Been Implemented

Email notifications are now integrated into TaskFlow! Here's what happens:

### 1. **User Signup**
- ✉️ User receives a welcome email with motivational message
- ✉️ Admin receives notification about new user registration

### 2. **Task Created**
- ✉️ User receives confirmation email with motivational message: "Great start! Every journey begins with a single step. 🚀"

### 3. **Task Status Updates**
- ✉️ **In Progress**: "You're making progress! Keep up the momentum! 💪"
- ✉️ **Completed**: "Awesome work! You're crushing it! 🎉"

---

## 🔧 Setup Instructions

### Step 1: Install Nodemailer
```bash
cd backend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 2: Configure Gmail (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification
   - Enable it if not already enabled

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "TaskFlow"
   - Copy the 16-character password

3. **Update `.env` file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ADMIN_EMAIL=your-admin-email@gmail.com
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: For Production (Render)

Add these environment variables in your Render dashboard:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@taskflow.com
FRONTEND_URL=https://task-management-app-frontend-vqtn.onrender.com
```

---

## 🧪 Testing

### Test Locally:
1. Update your `.env` with real email credentials
2. Run the backend: `npm run dev`
3. Create a new account → Check both user and admin emails
4. Create a task → Check user email
5. Mark task as in-progress → Check user email
6. Mark task as completed → Check user email

### Test Commands:
```bash
# Build
npm run build

# Start
npm start
```

---

## 🎨 Email Templates

All emails include:
- ✅ Beautiful HTML design with gradients
- ✅ Responsive layout
- ✅ TaskFlow branding
- ✅ Motivational messages
- ✅ Clear call-to-actions

---

## 🚀 Alternative Email Services (Production)

For better deliverability in production, consider:

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

---

## 📝 Notes

- Emails are sent asynchronously (non-blocking)
- Email failures won't break the main operations
- All email errors are logged to console
- Emails include inline CSS for better compatibility

---

## 🐛 Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2FA is enabled on your Google account

### Emails not sending
- Check your `.env` file has correct credentials
- Verify EMAIL_USER and EMAIL_PASSWORD are set
- Check console logs for specific errors

### Emails going to spam
- Use a professional email service (SendGrid, AWS SES)
- Set up SPF and DKIM records for your domain
- Warm up your email sending gradually

---

## ✨ Features

- 🎯 Welcome emails for new users
- 📧 Admin notifications for new signups
- ✅ Task creation confirmations
- 📊 Task status update notifications
- 💪 Motivational messages
- 🎨 Beautiful HTML templates
- 🚀 Non-blocking async sending

Enjoy your new email notification system! 🎉
