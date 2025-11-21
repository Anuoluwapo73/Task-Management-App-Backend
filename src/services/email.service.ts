import nodemailer from 'nodemailer';
import config from '../config';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
    },
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Send welcome email to new user
export const sendWelcomeEmail = async (userEmail: string, username: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: `"TaskFlow" <${config.EMAIL_USER}>`,
            to: userEmail,
            subject: '🎉 Welcome to TaskFlow!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to TaskFlow!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username}! 👋</h2>
              <p>We're thrilled to have you join TaskFlow - your personal productivity companion!</p>
              <p><strong>Great start! Every journey begins with a single step. 🚀</strong></p>
              <p>With TaskFlow, you can:</p>
              <ul>
                <li>✅ Create and organize tasks effortlessly</li>
                <li>📊 Track your progress in real-time</li>
                <li>🎯 Stay focused on what matters most</li>
                <li>🏆 Achieve your goals one task at a time</li>
              </ul>
              <p>Ready to get started? Log in and create your first task!</p>
              <div style="text-align: center;">
                <a href="${config.FRONTEND_URL || 'https://task-management-app-frontend-vqtn.onrender.com'}/login" class="button">Get Started</a>
              </div>
              <p style="margin-top: 30px; font-style: italic; color: #667eea;">
                "The secret of getting ahead is getting started." - Mark Twain
              </p>
            </div>
            <div class="footer">
              <p>© 2024 TaskFlow. Organize. Execute. Succeed.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

// Send notification to admin about new user
export const sendAdminNotification = async (userEmail: string, username: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: `"TaskFlow System" <${config.EMAIL_USER}>`,
            to: config.ADMIN_EMAIL,
            subject: '🎉 New User Registration - TaskFlow',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📢 New User Registration</h2>
            </div>
            <div class="content">
              <p>A new user has joined TaskFlow!</p>
              <div class="info-box">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p>Welcome email has been sent to the user.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Admin notification sent for new user: ${username}`);
        return true;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return false;
    }
};

// Send task created confirmation email
export const sendTaskCreatedEmail = async (
    userEmail: string,
    username: string,
    taskTitle: string
): Promise<boolean> => {
    try {
        const mailOptions = {
            from: `"TaskFlow" <${config.EMAIL_USER}>`,
            to: userEmail,
            subject: '✅ New Task Created - TaskFlow',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
            .motivation { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; font-style: italic; color: #2c3e50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎯 Task Created Successfully!</h2>
            </div>
            <div class="content">
              <p>Hi ${username}! 👋</p>
              <p>You've just created a new task:</p>
              <div class="task-box">
                <h3 style="margin: 0; color: #667eea;">📝 ${taskTitle}</h3>
                <p style="margin: 10px 0 0 0; color: #666;">Status: <strong>Pending</strong></p>
              </div>
              <div class="motivation">
                <p style="margin: 0; font-size: 16px;">
                  <strong>🚀 Great start! Every journey begins with a single step.</strong>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">
                  You're one step closer to achieving your goals. Keep the momentum going!
                </p>
              </div>
              <p>Ready to make progress? Mark it as in-progress when you start working on it!</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Task created email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending task created email:', error);
        return false;
    }
};

// Send task status update email
export const sendTaskStatusEmail = async (
    userEmail: string,
    username: string,
    taskTitle: string,
    status: string
): Promise<boolean> => {
    try {
        // Determine motivation message and styling based on status
        let motivationMessage = '';
        let statusEmoji = '';
        let statusColor = '';

        switch (status) {
            case 'in-progress':
                motivationMessage = "💪 You're making progress! Keep up the momentum!";
                statusEmoji = '⚡';
                statusColor = '#f59e0b';
                break;
            case 'completed':
                motivationMessage = "🎉 Awesome work! You're crushing it!";
                statusEmoji = '✅';
                statusColor = '#10b981';
                break;
            case 'pending':
                motivationMessage = "📋 Task is waiting for you. You've got this!";
                statusEmoji = '⏳';
                statusColor = '#6b7280';
                break;
            default:
                motivationMessage = "Keep going! You're doing great!";
                statusEmoji = '📌';
                statusColor = '#667eea';
        }

        const mailOptions = {
            from: `"TaskFlow" <${config.EMAIL_USER}>`,
            to: userEmail,
            subject: `${statusEmoji} Task Status Updated - TaskFlow`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .task-box { background: white; padding: 20px; border-left: 4px solid ${statusColor}; margin: 20px 0; border-radius: 5px; }
            .motivation { background: #e8f4f8; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
            .status-badge { display: inline-block; padding: 5px 15px; background: ${statusColor}; color: white; border-radius: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${statusEmoji} Task Status Updated!</h2>
            </div>
            <div class="content">
              <p>Hi ${username}! 👋</p>
              <p>Your task status has been updated:</p>
              <div class="task-box">
                <h3 style="margin: 0; color: #2c3e50;">📝 ${taskTitle}</h3>
                <p style="margin: 15px 0 0 0;">
                  Status: <span class="status-badge">${status.toUpperCase().replace('-', ' ')}</span>
                </p>
              </div>
              <div class="motivation">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2c3e50;">
                  ${motivationMessage}
                </p>
                ${status === 'completed' ? `
                  <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                    Another one done! You're building great momentum. What's next on your list?
                  </p>
                ` : status === 'in-progress' ? `
                  <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                    Focus on one task at a time, and you'll be amazed at what you can accomplish!
                  </p>
                ` : ''}
              </div>
              ${status === 'completed' ? `
                <p style="text-align: center; font-size: 24px; margin: 20px 0;">🏆 🎊 🌟</p>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Task status email sent to ${userEmail} for status: ${status}`);
        return true;
    } catch (error) {
        console.error('Error sending task status email:', error);
        return false;
    }
};
