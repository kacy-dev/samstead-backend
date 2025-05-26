export const adminRegistrationTemplate = (userName: string, otp: string): string => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              color: #FF5722;
            }
            .content {
              padding: 10px 20px;
              line-height: 1.6;
              color: #333;
            }
            .otp {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              color: #FF5722;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1 class="header">Welcome to the Samstead Admin Team!</h1>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>We’re excited to have you onboard as an administrator for Samstead. Your account has been successfully created, granting you access to manage and oversee operations.</p>
              <p>To finalize your account setup, please use the OTP below to verify your admin account. This OTP is valid for 10 minutes:</p>
              <div class="otp">${otp}</div>
              <p>If you encounter any issues during setup, feel free to contact our support team for assistance.</p>
              <p>Thank you for joining us. Let’s work together to make Samstead even better!</p>
              <p>Best Regards,<br/>The Samstead Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Samstead. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  


export const userRegistrationTemplate = (firstName: string, otp: string): string => {
    return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #4CAF50;
                }
                .content {
                    padding: 10px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .otp {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    color: #4CAF50;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="header">Welcome to Samstead!</h1>
                <div class="content">
                    <p>Hi ${firstName},</p>
                    <p>We’re thrilled to have you join the Samstead community. Your account has been successfully created, and you can now explore the latest trends, shop your favorite styles, and much more.</p>
                    <p>To complete your registration, please use the OTP below to verify your account. This OTP is valid for 10 minutes:</p>
                    <div class="otp">${otp}</div>
                    <p>If you have any questions or need assistance, our support team is always here to help you. Happy shopping!</p>
                    <p>Thank you for choosing Samstead.</p>
                    <p>Best Regards,<br/>The Samstead Team</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Samstead. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};



export const otpForgotPasswordTemplate = (otp: string, firstName: string): string => {
    return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #4CAF50;
                }
                .content {
                    padding: 10px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .otp {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    color: #4CAF50;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="header">Password Reset Request</h1>
                <div class="content">
                    <p>Hi ${firstName || "Esteemed Customer"},</p>
                    <p>You have requested to reset your password. Use the OTP below to proceed with resetting your password. This OTP is valid for 10 minutes.</p>
                    <div class="otp">${otp}</div>
                    <p>If you didn’t request this, please ignore this email or contact support if you’re concerned.</p>
                    <p>Thank you,<br/>The Samstead Team</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Samstead. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};



export const resendOtpTemplate = ( otp: string): string => {
    return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #FF9800;
                }
                .content {
                    padding: 10px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .otp {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    color: #FF9800;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="header">Your New OTP</h1>
                <div class="content">
                    <p>Hi Esteemed Customer,</p>
                    <p>You’ve requested a new OTP to continue your verification process at Samstead.</p>
                    <p>Here is your new OTP, valid for the next 10 minutes:</p>
                    <div class="otp">${otp}</div>
                    <p>If you did not request this, please ignore this email or contact support for assistance.</p>
                    <p>Thank you,<br/>The Samstead Team</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Samstead. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};